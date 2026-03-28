import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Thermometer } from "lucide-react";

interface WeatherData {
  temperature: number;
  weathercode: number;
  windspeed: number;
}

const WEATHER_LABELS: Record<number, { label: string; icon: typeof Sun }> = {
  0: { label: "맑음", icon: Sun },
  1: { label: "대체로 맑음", icon: Sun },
  2: { label: "구름 조금", icon: Cloud },
  3: { label: "흐림", icon: Cloud },
  45: { label: "안개", icon: CloudFog },
  48: { label: "안개", icon: CloudFog },
  51: { label: "이슬비", icon: CloudDrizzle },
  53: { label: "이슬비", icon: CloudDrizzle },
  55: { label: "이슬비", icon: CloudDrizzle },
  61: { label: "비", icon: CloudRain },
  63: { label: "비", icon: CloudRain },
  65: { label: "폭우", icon: CloudRain },
  71: { label: "눈", icon: CloudSnow },
  73: { label: "눈", icon: CloudSnow },
  75: { label: "폭설", icon: CloudSnow },
  80: { label: "소나기", icon: CloudRain },
  81: { label: "소나기", icon: CloudRain },
  82: { label: "강한 소나기", icon: CloudRain },
  95: { label: "뇌우", icon: CloudLightning },
  96: { label: "뇌우", icon: CloudLightning },
  99: { label: "뇌우", icon: CloudLightning },
};

function getWeatherInfo(code: number) {
  return WEATHER_LABELS[code] || { label: "알 수 없음", icon: Cloud };
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function WeatherClock() {
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=37.3595&longitude=127.1054&current_weather=true&timezone=Asia/Seoul"
        );
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();
        setWeather(data.current_weather);
        setWeatherError(false);
      } catch {
        setWeatherError(true);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const weatherInfo = weather ? getWeatherInfo(weather.weathercode) : null;
  const WeatherIcon = weatherInfo?.icon || Cloud;

  return (
    <Card className="p-4">
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold tabular-nums tracking-tight font-mono" data-testid="text-current-time">
          {formatTime(now)}
        </div>
        <div className="text-xs text-muted-foreground" data-testid="text-current-date">
          {formatDate(now)}
        </div>

        {weather && !weatherError ? (
          <div className="flex items-center justify-center gap-3 pt-2 border-t mt-2">
            <WeatherIcon className="w-6 h-6 text-primary" />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold" data-testid="text-temperature">
                  {weather.temperature}°C
                </span>
              </div>
              <div className="text-xs text-muted-foreground" data-testid="text-weather-label">
                {weatherInfo?.label} · 풍속 {weather.windspeed}km/h
              </div>
            </div>
          </div>
        ) : weatherError ? (
          <div className="text-xs text-muted-foreground pt-2 border-t mt-2">
            날씨 정보를 불러올 수 없습니다
          </div>
        ) : (
          <div className="text-xs text-muted-foreground pt-2 border-t mt-2">
            날씨 불러오는 중...
          </div>
        )}
        <div className="text-[10px] text-muted-foreground/60">
          성남시 (NAVER 1784)
        </div>
      </div>
    </Card>
  );
}
