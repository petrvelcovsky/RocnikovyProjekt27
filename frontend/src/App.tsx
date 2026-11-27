import { useState } from "react";
import "./App.css";

// Seznam zařízení
const devices = [
  { id: "climate_Ostrava", name: "LORDERAN CLIMATE TEST CHAMBER Ostrava" },
  { id: "climate_Plzen", name: "WEISSTECHNIK CLIMATE TEST CHAMBER Plzen" },
  { id: "climate_Praha", name: "VOTSCH CLIMATE TEST CHAMBER Praha" },
  { id: "scanner_Praha", name: "STEINBICHLER COMET 5 4M 3D SCANNER Praha" },
  { id: "scanner_Brno", name: "ARTEC NEO 3D  SCANNER Brno" },
  { id: "scanner_Ostrava", name: "ZEISS SCAN PORT 3D SCANNER Ostrava" },
  {
    id: "cmm_Olomouc",
    name: "LAIYIN MT 3D HIGH PRECISION QUALITY TEST CMM Olomouc",
  },
  { id: "cmm_Brno", name: "MITUTOYO CRYSTA APEX 3D CMM Brno" },
  { id: "cmm_Ostrava", name: "MITUTOYO CRYSTA APEX 574 PLUS M CMM Ostrava" },
  { id: "salt_Plzen", name: "ASCOTT SALT SPRAY CHAMBER S2000 IS Plzen" },
  {
    id: "corrossion_Studenka",
    name: "ASCOTT CYCLIC CORROSSION TEST CHAMBER Studenka",
  },
  {
    id: "pollutant_Ostrava",
    name: "WEISS TECHNIK AIR EVENTAIR POLLUTANT AND CORROSIVE GAS TEST CHAMBER Ostrava",
  },
  {
    id: "photogoniometer_Ostrava",
    name: "OPTRONIK AMS 3000 PHOTOGONIOMETER Ostrava",
  },
  {
    id: "photogoniometer_Brno",
    name: "LMT LICHTMESSTECHNIK GO-V 1920 PHOTOGONIOMETER Brno",
  },
];

// Ukázkové rezervace
const reservations = [
  {
    id: 1,
    deviceId: "scanner_Praha",
    day: 0,
    start: 8,
    end: 14,
    email: "zuzka@company.cz",
  },
  {
    id: 2,
    deviceId: "scanner_Praha",
    day: 1,
    start: 6,
    end: 11,
    email: "venda@company.cz",
  },
  {
    id: 3,
    deviceId: "scanner_Praha",
    day: 3,
    start: 7,
    end: 14,
    email: "karel@company.cz",
  },
  {
    id: 4,
    deviceId: "scanner_Praha",
    day: 4,
    start: 6,
    end: 8,
    email: "marie@company.cz",
  },
];

// Pomocné funkce pro práci s datem
function getMonday(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

function App() {
  const [selectedDevice, setSelectedDevice] = useState("scanner");
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));

  const days = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index),
  );

  const selectedDeviceName =
    devices.find((device) => device.id === selectedDevice)?.name ?? "";

  function changeWeek(direction: number) {
    setWeekStart((current) => addDays(current, direction * 7));
  }

  function goToToday() {
    setWeekStart(getMonday(new Date()));
  }

  return (
    <main className="app">
      <header className="top-bar">
        <div className="user-email">Přihlášený uživatel</div>

        <select
          className="device-select"
          value={selectedDevice}
          onChange={(event) => setSelectedDevice(event.target.value)}
          aria-label="Vybrat zařízení"
        >
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>

        <div className="week-navigation">
          <button onClick={() => changeWeek(-1)}>‹ Předchozí týden</button>
          <button onClick={goToToday}>Dnes</button>
          <button onClick={() => changeWeek(1)}>Následující týden ›</button>
        </div>
      </header>

      <h1 className="device-heading">{selectedDeviceName}</h1>

      <p className="week-range">
        {formatDate(days[0])} – {formatDate(days[6])}
      </p>

      <section className="calendar">
        <div className="calendar-header">
          <div className="time-header"></div>

          {days.map((day, index) => (
            <div className="day-header" key={index}>
              {day.toLocaleDateString("cs-CZ", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </div>
          ))}
        </div>

        <div className="calendar-body">
          <div className="time-column">
            {Array.from({ length: 24 }, (_, hour) => (
              <div className="time-label" key={hour}>
                {hour}:00
              </div>
            ))}
          </div>

          {days.map((day, dayIndex) => (
            <div className="day-column" key={dayIndex}>
              {Array.from({ length: 24 }, (_, hour) => (
                <div className="hour-line" key={hour}></div>
              ))}

              {reservations
                .filter(
                  (reservation) =>
                    reservation.deviceId === selectedDevice &&
                    reservation.day === dayIndex,
                )
                .map((reservation) => (
                  <button
                    className="reservation"
                    key={reservation.id}
                    style={{
                      top: `${(reservation.start / 24) * 100}%`,
                      height: `${((reservation.end - reservation.start) / 24) * 100}%`,
                    }}
                    title={`${reservation.email}: ${reservation.start}:00–${reservation.end}:00`}
                  >
                    <strong>{reservation.email}</strong>
                    <span>
                      {reservation.start}:00–{reservation.end}:00
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
