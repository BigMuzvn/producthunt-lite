import { faqItems } from '../data/faq'
import FAQItem from './FAQItem'

function FAQ() {
  return (
    <section id="faq" className="container">
      <div className="section-header">
        <p className="section-eyebrow">Besoin d'aide</p>
        <h2>Questions fréquentes</h2>
      </div>
      <div className="faq-list">
        {faqItems.map((item) => (
          <FAQItem key={item.id} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  )
}

export default FAQ