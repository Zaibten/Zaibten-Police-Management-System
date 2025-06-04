import { useEffect, useState } from 'react'
import ContentSection from '../components/content-section'

export default function SettingsProfile() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100)
  }, [])

  const baseTransition = 'all 0.6s ease'

  const fadeInStyle = (delay: number): React.CSSProperties => ({
    opacity: animate ? 1 : 0,
    transform: animate ? 'translateY(0)' : 'translateY(20px)',
    transition: `${baseTransition} ${delay}s`,
  })

  return (
    <ContentSection
      title='About Us'
      desc='Provide your organization or team description to display publicly. This information helps users understand your mission, values, and background.'
    >
      <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif', color: '#111827' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '12px',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            ...fadeInStyle(0.2),
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Empowering Police Duty Management
        </h2>

        <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '16px', ...fadeInStyle(0.4) }}>
          Our Police Management System is designed to automate and optimize police duty assignments,
          shift tracking, and personnel coordination—ensuring efficient, transparent, and timely
          law enforcement operations.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '16px', ...fadeInStyle(0.6) }}>
          Whether it's daily patrols or emergency deployments, our system keeps the force aligned
          and mission-ready. Officers get real-time duty updates, digital logs, and accountability
          without the paperwork hassle.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.7', ...fadeInStyle(0.8) }}>
          Backed by technology, driven by integrity—our platform supports those who serve with
          dedication and discipline. It's more than just duty management—it's a commitment to
          excellence in policing.
        </p>
      </div>
    </ContentSection>
  )
}
