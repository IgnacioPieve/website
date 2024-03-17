import React from 'react';
import './index.css'

import profileImage from './img/profile.png'
import esFlag from './img/flags/es.svg'
import usFlag from './img/flags/us.svg'

const Home = () => {

    const flagStyle = {
        'vertical-align': 'middle',
        'height': '20px'
    }

    var selectedLanguage = 'en';

    function changeLanguage() {
        const englishButton = document.getElementById('btnLanguageEnglish');
        const spanishButton = document.getElementById('btnLanguageSpanish');
        const presentation = document.querySelector('.profile h2');
        const aboutMe = document.querySelector('.profile p');
        const linkedin_url = document.querySelector('.linkedin a');

        if (selectedLanguage === 'en') {
            selectedLanguage = 'es';
            spanishButton.hidden = false;
            englishButton.hidden = true;
            presentation.textContent = '👋 Hola, soy Ignacio Pieve';
            aboutMe.innerHTML = 'Soy <b>Ingeniero en Sistemas de Información</b> en el equipo de ecommerce de Bigbox.<br/>' +
                'Apasionado por crear <b>soluciones innovadoras</b>. Con amor por la programación y <b>resolución de problemas</b>.<br/>' +
                '<b>Conectemos</b> y exploremos juntos las posibilidades que nos ofrece la tecnología! 🚀'
            linkedin_url.href = 'https://www.linkedin.com/in/ignaciopieve/';
        } else if (selectedLanguage === 'es') {
            selectedLanguage = 'en';
            spanishButton.hidden = true;
            englishButton.hidden = false;
            presentation.textContent = '👋 Hi, I\'m Ignacio Pieve';
            aboutMe.innerHTML = 'I\'m a <b>Software Engineer</b> at Bigbox on the ecommerce team.<br/>' +
                'Passionate about building <b>innovative solutions</b>. With a love for coding and <b>problem-solving</b>.<br/>' +
                '<b>Let\'s connect</b> and explore the possibilities of technology together! 🚀'
            linkedin_url.href = 'https://www.linkedin.com/in/ignaciopieve/?locale=en_US';
        }
    }

    return (
        <div>
            <div className="language-selector">
                <button id="btnLanguage" onClick={changeLanguage}>
                    <span id="btnLanguageEnglish">
                        <img src={usFlag} alt="Spanish Flag" style={flagStyle}/>
                         English
                    </span>
                    <span id="btnLanguageSpanish" hidden="hidden">
                        <img src={esFlag} alt="English Flag" style={flagStyle}/>
                         Español
                    </span>
                </button>
            </div>

            <div className="profile">
                <img src={profileImage} alt="Profile"/>
                <h2>👋 Hi, I'm Ignacio Pieve</h2>
                <p>
                    I'm a <b>Software Engineer</b> at Bigbox on the ecommerce team.<br/>
                    Passionate about building <b>innovative solutions</b>. With a love for coding
                    and <b>problem-solving.</b><br/>
                    <b>Let's connect</b> and explore the possibilities of technology together! 🚀
                </p>
                <div className="contact">
                    <div className="mail">
                        <a href="mailto:ignacio.pieve@gmail.com?">ignacio.pieve@gmail.com</a>
                        <br/>
                    </div>
                    <div className="phone">
                        +54 9 351 663 7217<br/>
                    </div>
                    <div className="github">
                        <i className="fa-brands fa-github"></i>
                        <b> Github:</b>
                        <a href="https://github.com/IgnacioPieve" target="_blank" rel="noreferrer">github.com/IgnacioPieve</a>
                        <br/>
                    </div>
                    <div className="linkedin">
                        <i className="fa-brands fa-linkedin"></i>
                        <b> LinkedIn:</b>
                        <a href="https://www.linkedin.com/in/ignaciopieve/?locale=en_US"
                           target="_blank" rel="noreferrer">linkedin.com/in/ignaciopieve</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
