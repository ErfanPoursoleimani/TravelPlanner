import React, { useState, useRef, useEffect } from 'react';

// Simple chevron components
const ChevronLeftIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

// Calendar icon
const CalendarIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// Utility function to combine class names
const cn = (...classes: (string | undefined | null | boolean | number)[]): string => 
  classes.filter(Boolean).join(' ');

// Types
interface CalendarDay {
  day: number | null;
  isCurrentMonth: boolean;
  isNextMonth: boolean;
  key: string;
}

export interface CalendarProps {
  className?: string;
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  mode?: 'single' | 'range';
  showOutsideDays?: boolean;
  disabled?: (date: Date) => boolean;
}

// Calendar Component (exact replica)
const Calendar: React.FC<CalendarProps> = ({ 
  className = '',
  selected,
  onSelect,
  mode = 'single',
  showOutsideDays = true,
  disabled,
  ...props 
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(selected || new Date());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Get previous month days to fill the grid
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();
  
  const monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Navigate months
  const goToPrevMonth = (): void => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = (): void => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Check if a date is disabled (before today)
  const isDateDisabled = (day: number, isCurrentMonth: boolean, isNextMonth: boolean): boolean => {
    let checkDate: Date;
    if (isCurrentMonth) {
      checkDate = new Date(currentYear, currentMonth, day);
    } else if (isNextMonth) {
      checkDate = new Date(currentYear, currentMonth + 1, day);
    } else {
      checkDate = new Date(currentYear, currentMonth - 1, day);
    }
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate < today;
  };
  
  // Handle day selection
  const handleDayClick = (day: number, isCurrentMonth: boolean, isNextMonth: boolean): void => {
    if (!onSelect) return;
    
    let selectedDate: Date;
    if (isCurrentMonth) {
      selectedDate = new Date(currentYear, currentMonth, day);
    } else if (isNextMonth) {
      selectedDate = new Date(currentYear, currentMonth + 1, day);
    } else {
      selectedDate = new Date(currentYear, currentMonth - 1, day);
    }
    
    // Don't select if disabled
    if (isDateDisabled(day, isCurrentMonth, isNextMonth)) {
      return;
    }
    
    onSelect(selectedDate);
  };
  
  // Check if date is selected
  const isSelected = (day: number, isCurrentMonth: boolean, isNextMonth: boolean): boolean => {
    if (!selected) return false;
    
    let checkDate: Date;
    if (isCurrentMonth) {
      checkDate = new Date(currentYear, currentMonth, day);
    } else if (isNextMonth) {
      checkDate = new Date(currentYear, currentMonth + 1, day);
    } else {
      checkDate = new Date(currentYear, currentMonth - 1, day);
    }
    
    return selected.toDateString() === checkDate.toDateString();
  };
  
  // Check if date is today
  const isToday = (day: number, isCurrentMonth: boolean): boolean => {
    if (!isCurrentMonth) return false;
    const checkDate = new Date(currentYear, currentMonth, day);
    return today.toDateString() === checkDate.toDateString();
  };
  
  // Generate calendar grid
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    
    // Previous month days
    if (showOutsideDays) {
      for (let i = firstDayWeekday - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        days.push({
          day,
          isCurrentMonth: false,
          isNextMonth: false,
          key: `prev-${day}`
        });
      }
    } else {
      for (let i = 0; i < firstDayWeekday; i++) {
        days.push({ day: null, isCurrentMonth: false, isNextMonth: false, key: `empty-${i}` });
      }
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isNextMonth: false,
        key: `current-${day}`
      });
    }
    
    // Next month days to fill the grid
    if (showOutsideDays) {
      const totalCells = Math.ceil((firstDayWeekday + daysInMonth) / 7) * 7;
      const remainingCells = totalCells - (firstDayWeekday + daysInMonth);
      
      for (let day = 1; day <= remainingCells; day++) {
        days.push({
          day,
          isCurrentMonth: false,
          isNextMonth: true,
          key: `next-${day}`
        });
      }
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  return (
    <div className={cn("p-3", className)}>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
        <div className="space-y-4">
          <div className="flex justify-center pt-1 relative items-center">
            <div className="text-sm font-medium">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <div className="space-x-1 flex items-center">
              <button
                onClick={goToPrevMonth}
                className="absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={goToNextMonth}
                className="absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
          
          <div className="w-full border-collapse space-y-1">
            <div className="flex">
              {dayNames.map((day: string) => (
                <div key={day} className="text-gray-500 rounded-md w-8 font-normal text-xs text-center">
                  {day}
                </div>
              ))}
            </div>
            
            {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex: number) => (
              <div key={weekIndex} className="flex w-full mt-2">
                {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map(({ day, isCurrentMonth, isNextMonth, key }) => (
                  <div 
                    key={key} 
                    className={cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                      day !== null && isSelected(day, isCurrentMonth, isNextMonth) && "[&:has([aria-selected])]:bg-blue-100",
                      mode === "range" 
                        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        : day !== null && isSelected(day, isCurrentMonth, isNextMonth) && "rounded-md"
                    )}
                  >
                    {day && (
                      <button
                        onClick={() => handleDayClick(day, isCurrentMonth, isNextMonth)}
                        disabled={isDateDisabled(day, isCurrentMonth, isNextMonth)}
                        aria-selected={isSelected(day, isCurrentMonth, isNextMonth)}
                        className={cn(
                          "h-8 w-8 p-0 font-normal hover:bg-gray-100 rounded",
                          isSelected(day, isCurrentMonth, isNextMonth) && "bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                          isToday(day, isCurrentMonth) && !isSelected(day, isCurrentMonth, isNextMonth) && "bg-gray-100 text-gray-900",
                          !isCurrentMonth && "text-gray-500 opacity-50",
                          isDateDisabled(day, isCurrentMonth, isNextMonth) && "text-gray-300 opacity-30 cursor-not-allowed hover:bg-transparent"
                        )}
                      >
                        {day}
                      </button>
                    )}
                    {!day && <div className="h-8 w-8"></div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;