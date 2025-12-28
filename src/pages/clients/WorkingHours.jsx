import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { usePublicWorkingHours } from "../../hooks/usePublicWorkingHours";

/* Helper Functions */
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const timeParts = timeStr.split(':');
  const hours = parseInt(timeParts[0]) || 0;
  const minutes = parseInt(timeParts[1]) || 0;
  return hours * 60 + minutes;
}

function isOpenNow(workingHours, now = new Date()) {
  const today = now.getDay(); // 0 = Sunday, 6 = Saturday
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const todayHours = workingHours.find(day => day.day_of_week === today);
  
  if (!todayHours || todayHours.is_closed) {
    return false;
  }

  const openMinutes = timeToMinutes(todayHours.open_time);
  const closeMinutes = timeToMinutes(todayHours.close_time);
  
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

function getNextOpening(workingHours, from = new Date()) {
  const currentDay = from.getDay();
  const currentMinutes = from.getHours() * 60 + from.getMinutes();
  
  // Check today first
  const todayHours = workingHours.find(day => day.day_of_week === currentDay);
  if (todayHours && !todayHours.is_closed) {
    const closeMinutes = timeToMinutes(todayHours.close_time);
    if (currentMinutes < closeMinutes) {
      return {
        type: "until",
        time: todayHours.close_time,
        day: currentDay
      };
    }
  }
  
  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7;
    const nextDayHours = workingHours.find(day => day.day_of_week === nextDay);
    
    if (nextDayHours && !nextDayHours.is_closed) {
      return {
        type: "next",
        day: nextDay,
        open_time: nextDayHours.open_time,
        close_time: nextDayHours.close_time
      };
    }
  }
  
  return null;
}

function humanTime(timeStr, use24h = true) {
  if (!timeStr) return "";
  
  if (use24h) return timeStr;
  
  // Convert to 12-hour format
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const twelveHour = hours % 12 || 12;
  
  return `${twelveHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Function to get city name from coordinates using reverse geocoding
async function getCityFromCoordinates(lat, lon) {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ar`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding API failed');
    }
    
    const data = await response.json();
    return data.city || data.locality || data.principalSubdivision || 'موقعك الحالي';
  } catch (error) {
    console.error('Error getting city name:', error);
    return 'موقعك الحالي';
  }
}

// Function to get city name from timezone as fallback
function getCityFromTimezone() {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const timezoneMap = {
    'Asia/Riyadh': 'الرياض',
    'Asia/Dubai': 'دبي',
    'Asia/Bahrain': 'المنامة',
    'Asia/Kuwait': 'الكويت',
    'Asia/Qatar': 'الدوحة',
    'Asia/Muscat': 'مسقط',
    'Asia/Amman': 'عمان',
    'Asia/Beirut': 'بيروت',
    'Asia/Damascus': 'دمشق',
    'Asia/Baghdad': 'بغداد',
    'Europe/London': 'لندن',
    'America/New_York': 'نيويورك',
    'Europe/Paris': 'باريس'
  };
  
  return timezoneMap[userTimezone] || 'موقعك الحالي';
}

export default function WorkingHoursPage({ salonId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { salonData, workingHours, loading, error } = usePublicWorkingHours(salonId);
  const [use24h, setUse24h] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('');
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState('');

  const brandColor = salonData?.brand_color || "#E39B34";
  // const brandSoft = `rgba(${parseInt(brandColor.slice(1, 3), 16)}, ${parseInt(brandColor.slice(3, 5), 16)}, ${parseInt(brandColor.slice(5, 7), 16)}, 0.12)`;
  const brandLight = `rgba(${parseInt(brandColor.slice(1, 3), 16)}, ${parseInt(brandColor.slice(3, 5), 16)}, ${parseInt(brandColor.slice(5, 7), 16)}, 0.06)`;

  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLocationLoading(true);
        setLocationError('');

        // Check if geolocation is supported
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser');
        }

        // Get current position
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        });

        const { latitude, longitude } = position.coords;
        
        // Get city name from coordinates
        const cityName = await getCityFromCoordinates(latitude, longitude);
        setCurrentLocation(cityName);
        
      } catch (error) {
        console.error('Error detecting location:', error);
        
        // Fallback to timezone-based detection
        const fallbackLocation = getCityFromTimezone();
        setCurrentLocation(fallbackLocation);
        
        // Set appropriate error message
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('تم رفض الإذن بالوصول إلى الموقع');
        } else if (error.code === error.TIMEOUT) {
          setLocationError('انتهت مهلة اكتشاف الموقع');
        } else {
          setLocationError('تعذر اكتشاف الموقع الدقيق');
        }
      } finally {
        setLocationLoading(false);
      }
    };

    detectLocation();
  }, []);

  const now = new Date();
  const isOpen = useMemo(() => isOpenNow(workingHours, now), [workingHours]);
  const nextOpening = useMemo(() => getNextOpening(workingHours, now), [workingHours]);

  const days = useMemo(
    () => [
      t("days.sun"), t("days.mon"), t("days.tue"), t("days.wed"),
      t("days.thu"), t("days.fri"), t("days.sat"),
    ],
    [t]
  );

  // Calculate today's hours for quick overview
  const todayHours = useMemo(() => {
    const today = now.getDay();
    return workingHours.find(day => day.day_of_week === today);
  }, [workingHours]);

  if (loading) {
    return (
      <section className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 mx-auto mb-4" 
                 style={{ borderTopColor: brandColor, borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />
            <h3 className="text-xl font-bold text-gray-700 mb-2">جاري تحميل أوقات العمل</h3>
            <p className="text-gray-500">نستعد لعرض أحدث أوقات العمل</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">عذراً، حدث خطأ</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="rounded-xl px-6 py-3 font-bold text-white hover:shadow-lg transition-all"
              style={{ backgroundColor: brandColor }}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: brandColor }}></div>
            <span className="text-sm font-medium text-slate-600">
              {t("hours.badge", { defaultValue: "أوقات العمل" })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {salonData?.name || t("hours.title")}
          </h1>
          <div className="w-24 h-1.5 rounded-full mx-auto mb-6 opacity-60" style={{ backgroundColor: brandColor }} />
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t("hours.subtitle")}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Status Header */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-8 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {isOpen ? t("hours.openNow") : t("hours.closedNow")}
                  </h2>
                  {todayHours && !todayHours.is_closed && (
                    <p className="text-slate-600 mt-1">
                      اليوم: {humanTime(todayHours.open_time, use24h)} - {humanTime(todayHours.close_time, use24h)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-full px-3 py-2 border border-slate-200">
                  {locationLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري اكتشاف الموقع...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{currentLocation}</span>
                      {locationError && (
                        <span className="text-xs text-amber-600" title={locationError}>
                          (تقريبي)
                        </span>
                      )}
                    </>
                  )}
                </div>
                
                <label className="flex items-center gap-2 text-sm cursor-pointer bg-slate-100 rounded-full px-3 py-2">
                  <input
                    type="checkbox"
                    checked={!use24h}
                    onChange={() => setUse24h((v) => !v)}
                    className="cursor-pointer"
                  />
                  {t("hours.use12h")}
                </label>
              </div>
            </div>

            {/* Next Opening Banner */}
            {nextOpening && (
              <div className="mt-4 p-4 rounded-2xl" style={{ backgroundColor: brandLight }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center" style={{ color: brandColor }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm" style={{ color: brandColor }}>
                    {nextOpening.type === "until" ? (
                      <span>
                        {t("hours.openUntil", { time: humanTime(nextOpening.time, use24h) })}
                      </span>
                    ) : (
                      <span>
                        {t("hours.nextOpen", {
                          day: days[nextOpening.day],
                          range: `${humanTime(nextOpening.open_time, use24h)} – ${humanTime(nextOpening.close_time, use24h)}`
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Weekly Schedule */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }}></div>
              {t("hours.weeklySchedule", { defaultValue: "الجدول الأسبوعي" })}
            </h3>

            <div className="grid gap-4">
              {days.map((label, idx) => {
                const dayHours = workingHours.find(day => day.day_of_week === idx);
                const isToday = idx === now.getDay();
                const isClosed = !dayHours || dayHours.is_closed;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                      isToday 
                        ? 'ring-2 scale-105 shadow-lg' 
                        : 'hover:bg-slate-50 hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: isToday ? brandLight : 'white',
                      border: isToday ? 'none' : '1px solid #e2e8f0',
                      boxShadow: isToday ? `0 0 0 2px ${brandColor}20` : '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-semibold text-slate-900 text-lg min-w-[100px]">
                        {label}
                      </div>
                      {isToday && (
                        <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                          اليوم
                        </span>
                      )}
                    </div>
                    
                    <div className="text-slate-700 text-lg">
                      {isClosed ? (
                        <span className="text-slate-400 font-medium">{t("hours.closed")}</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {humanTime(dayHours.open_time, use24h)} 
                          </span>
                          <span className="text-slate-400">-</span>
                          <span className="font-semibold">
                            {humanTime(dayHours.close_time, use24h)}
                          </span>
                          <div className="w-2 h-2 rounded-full bg-green-500 ml-2"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-slate-600 text-center sm:text-right">
                  <p className="mb-2">{t("hours.needHelp", { defaultValue: "هل تحتاج إلى مساعدة؟" })}</p>
                  <button
                    onClick={() => navigate("/contact")}
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    style={{ color: brandColor }}
                  >
                    {t("hours.contactUs", { defaultValue: "تواصل معنا" })}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/sections")}
                    className="
                      inline-flex items-center rounded-xl border-2 px-6 py-3
                      text-sm font-semibold transition-all duration-300
                      hover:shadow-lg
                    "
                    style={{
                      borderColor: brandColor,
                      backgroundColor: 'white',
                      color: brandColor,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = brandLight;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                    }}
                  >
                    <svg className="me-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    {t("hours.viewServices", { defaultValue: "عرض الخدمات" })}
                  </button>

                  <button
                    onClick={() => navigate("/booking")}
                    className="
                      group/btn inline-flex items-center justify-center
                      rounded-xl font-bold text-sm px-8 py-3
                      transition-all duration-300 hover:shadow-xl
                      transform hover:scale-105
                    "
                    style={{
                      backgroundColor: brandColor,
                      color: 'white',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.backgroundColor = "#CF8A2B";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.backgroundColor = brandColor;
                    }}
                  >
                    <span>{t("hours.bookAppointment", { defaultValue: "احجز موعد" })}</span>
                    <svg
                      className="ms-3 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14" strokeLinecap="round" />
                      <path
                        d="M13 6l6 6-6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: brandLight }}>
              <svg className="w-6 h-6" style={{ color: brandColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-2">{t("hours.importantNote", { defaultValue: "ملاحظة هامة" })}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t("hours.note", { 
                  defaultValue: "قد تتغير أوقات العمل في المناسبات والعطل الرسمية. ننصح بالتأكد من الحجز المسبق لضمان توفر المواعيد المناسبة لك." 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}