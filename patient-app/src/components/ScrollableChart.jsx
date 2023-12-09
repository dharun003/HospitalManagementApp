import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './chart-container.css';

const ScrollableChart = ({ data }) => {
    const [filter, setFilter] = useState('daily'); // 'daily', 'monthly', 'yearly'
    const barThreshold = 10; 

    const filterData = (data, filter) => {
        // Convert the date string to a JavaScript Date object
        const getDateObject = (dateString) => {
            const [day, month, year] = dateString.split("-");
            return new Date(`${year}-${month}-${day}`);
        };

        if (filter === 'daily') {
            // Aggregate entries date-wise
            const aggregatedData = data.reduce((accumulator, entry) => {
                const dateKey = entry.date; // Assuming 'date' is the field containing the date in DD-MM-YYYY format
                const existingEntry = accumulator.find(item => item.date === dateKey);

                if (existingEntry) {
                    if (entry.transaction === 'Debit') {
                        existingEntry.value -= entry.value;
                    } else {
                        existingEntry.value += entry.value;
                    } // Assuming 'value' is the field containing the numerical value
                } else {
                    if (entry.transaction === 'Debit') {
                        accumulator.push({ date: dateKey, value: -entry.value });
                    } else {
                        accumulator.push({ date: dateKey, value: entry.value });
                    }
                }

                return accumulator;
            }, []);
           
            aggregatedData.sort((a, b) => {
                const dateA = getDateObject(a.date);
                const dateB = getDateObject(b.date);
                return dateA - dateB;
                // return Number(`${aYear}${aMonth}${aDay}`) - Number(`${bYear}${bMonth}${bDay}`);
            });
            console.log(aggregatedData);
            return aggregatedData;
        } else if (filter === 'monthly') {
            // Aggregate entries month-wise
            const aggregatedData = data.reduce((accumulator, entry) => {
                const date = getDateObject(entry.date);
                const monthYearKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
                const existingEntry = accumulator.find(item => item.date === monthYearKey);

                if (existingEntry) {
                    if (entry.transaction === 'Debit') {
                        existingEntry.value -= entry.value;
                    } else {
                        existingEntry.value += entry.value;
                    }
                } else {
                    if (entry.transaction === 'Debit') {
                        accumulator.push({ date: monthYearKey, value: -entry.value });
                    } else {
                        accumulator.push({ date: monthYearKey, value: entry.value });
                    }
                }

                return accumulator;
            }, []);

            aggregatedData.sort((a, b) => {
                const [aMonth, aYear] = a.date.split("/");
                const [bMonth, bYear] = b.date.split("/");
                return new Date(`${aYear}-${aMonth}-01`) - new Date(`${bYear}-${bMonth}-01`);
            });

            return aggregatedData;
        } else if (filter === 'yearly') {
            // Aggregate entries year-wise
            const aggregatedData = data.reduce((accumulator, entry) => {
                const date = getDateObject(entry.date);
                const yearKey = date.getFullYear().toString();
                const existingEntry = accumulator.find(item => item.date === yearKey);

                if (existingEntry) {
                    if (entry.transaction === 'Debit') {
                        existingEntry.value -= entry.value;
                    } else {
                        existingEntry.value += entry.value;
                    }
                } else {
                    if (entry.transaction === 'Debit') {
                        accumulator.push({ date: yearKey, value: -entry.value });
                    } else {
                        accumulator.push({ date: yearKey, value: entry.value });
                    }
                }

                return accumulator;
            }, []);
            // Sort aggregatedData by year in ascending order
            aggregatedData.sort((a, b) => parseInt(a.date) - parseInt(b.date));

            return aggregatedData;
        }

        return data;
    };


    const filteredData = filterData(data, filter);

    return (
        <div>
            <div>
                <button onClick={() => setFilter('daily')}>Daily</button>
                <button onClick={() => setFilter('monthly')}>Monthly</button>
                <button onClick={() => setFilter('yearly')}>Yearly</button>
            </div>
            <div style={{ width: '100%', overflowX: data.length > barThreshold ? 'auto' : 'hidden' , height: 400}}>
                <ResponsiveContainer width="90%">
                    <BarChart
                        data={filteredData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ScrollableChart;
