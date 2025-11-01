import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { AppHeader } from '../cmps/AppHeader';

import LogoImg from '../assets/img/Logo1.png'
import icon1Img from '../assets/img/icon1.png'
import icon2Img from '../assets/img/icon2.png'
import icon3Img from '../assets/img/icon3.png'

export function AtmoAction() {
    const navigate = useNavigate();

    const loggedinUser = useSelector((storeState) => storeState.userModule.user)

    console.log(loggedinUser);

    function goToAConsultation() {
        navigate('/consultation');
    }

    return (
        <section className='atmo-action flex column align-center '>

            <AppHeader />

            <section className='option flex align-center justify-center gap10'>
                <article className='action-card flex column align-center justify-center gap20'>
                    <img src={icon1Img} alt="" />
                    <h2>Cost Savings</h2>
                    <p>Get recommendations on how to reduce cloud costs.</p>
                </article>
                <article className='action-card flex column align-center justify-center gap20'>
                    <img src={icon2Img} alt="" />
                    <h2>Log Analysis</h2>
                    <p>Gain insights from cloud logs to monitor and troubleshoot.</p>
                </article>
                <article className='action-card flex column align-center justify-center gap20' onClick={goToAConsultation}>
                    <img src={icon3Img} alt="" />
                    <h2>Cloud Consultation</h2>
                    <p>Ask questions and get advice on your cloud environment.</p>
                </article>
            </section>
        </section>
    )
}

