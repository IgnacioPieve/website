var selectedLanguage = 'en';
const englishButton = document.getElementById('btnLanguageEnglish');
const spanishButton = document.getElementById('btnLanguageSpanish');
const presentation = document.querySelector('.profile h2');
const aboutMe = document.querySelector('.profile p');
const linkedin_url = document.querySelector('.linkedin a');

function changeLanguage() {

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
