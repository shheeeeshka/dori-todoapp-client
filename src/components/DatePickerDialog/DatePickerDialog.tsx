import { useState } from "react";
import { FaCalendar, FaXmark } from "react-icons/fa6";
import styles from "./DatePickerDialog.module.css";

interface DatePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate?: (date: Date) => void;
}

export const DatePickerDialog = ({
  isOpen,
  onClose,
  onSelectDate,
}: DatePickerDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    onSelectDate?.(date);
  };

  const today = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const startingDayOfWeek = firstDayOfMonth.getDay();

  const calendarDays = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.dialog}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.calendarIcon}>
              <FaCalendar size={20} />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>Select Date</h2>
              <p className={styles.subtitle}>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <FaXmark size={16} />
          </button>
        </div>

        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <button
              className={styles.navButton}
              onClick={() => navigateMonth("prev")}
            >
              ‹
            </button>
            <h3 className={styles.monthTitle}>
              {months[currentMonth]} {currentYear}
            </h3>
            <button
              className={styles.navButton}
              onClick={() => navigateMonth("next")}
            >
              ›
            </button>
          </div>

          <div className={styles.weekDays}>
            {daysOfWeek.map((day) => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            {calendarDays.map((date, index) => (
              <button
                key={index}
                className={`${styles.calendarDay} ${
                  date ? styles.hasDate : styles.empty
                } ${date && isToday(date) ? styles.today : ""} ${
                  date && isSelected(date) ? styles.selected : ""
                }`}
                onClick={() => date && handleSelect(date)}
                disabled={!date}
              >
                {date ? date.getDate() : ""}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={onClose}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};
