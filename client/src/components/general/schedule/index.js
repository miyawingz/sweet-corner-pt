import React from 'react';
import axios from 'axios';
import './schedule.scss';

class Schedule extends React.Component {
    componentDidMount() {
        axios.get('data/schedule.json').then((resp) => {
            this.setState({
                schedule: resp.data.schedule
            })
        });
    }

    render() {
        if (this.state) {
            const { schedule } = this.state;
            const scheduleRow = schedule.map(v => {
                return (
                    <div className="scheduleRow" key={v.pid}>
                        <div className="day">{v.day}</div>
                        <div className="time">{v.open} - {v.close}</div>
                    </div>
                )
            })
            return (
                <div className="scheduleTable">{scheduleRow}</div>
            )
        }

        return (<div>loading...</div>)
    }
}

export default Schedule;