import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate, onFetch }) => (
    <div className="d-flex align-items-end gap-3 mb-4">
        <div>
            <label>Start Time</label>
            <DatePicker
                selected={startDate}
                onChange={setStartDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select start"
                className="form-control"
            />
        </div>
        <div>
            <label>End Time</label>
            <DatePicker
                selected={endDate}
                onChange={setEndDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select end"
                className="form-control"
            />
        </div>
        <button className="btn btn-primary" onClick={onFetch}>Load Data</button>
    </div>
);

export default DateRangePicker;
