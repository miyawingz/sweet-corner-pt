import React from 'react';
import ContactForm from './contact_form';
import Schedule from '../general/schedule';
import UpDots from '../../assets/images/up-dots.png';
import DownDots from '../../assets/images/down-dots.png';

import './contact.scss';

export default props => {
    return (
        <div className="contact">
            <div className="content">
                <p className="subtitle">Contact us today!</p>
                <p>Talk cupcakes to us! At Sweet Corner's we love hearing from our customers. Send your questions, comments and flavor suggestions to:</p>
                <p>office@sweetcorner.com</p>
                <p>Our expert bakers are waiting to create an unique cupcake bursting with freshness and flavor just for you. Our management team are also waiting for their next event to organize.</p>
                <img src={UpDots}/>
            </div>
            <div className="contactForm">
                <p className="subtitle">Contact Form</p>
                <ContactForm />
            </div>
            <div className="schedule">
                <p className="subtitle">For phone orders, our work schedule is: </p>
                <Schedule />
            </div>
            <div className="backgroundImg">
            <img src={DownDots}/>
            </div>
        </div>
    )
}