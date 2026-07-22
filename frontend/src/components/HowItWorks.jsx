import { steps } from '../data/steps'

function HowItWorks() {
  return (
    <section id="how-it-works" className="container">
      <div className="section-header">
        <p className="section-eyebrow">Simple et rapide</p>
        <h2>Comment ça marche</h2>
      </div>
      <div className="steps-list">
        {steps.map((step, index) => (
          <div key={step.id} className="step-card">
            <div className="step-number-row">
              <span className="step-number">{index + 1}</span>
              {index < steps.length - 1 && <span className="step-connector"></span>}
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks