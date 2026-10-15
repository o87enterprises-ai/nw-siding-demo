import { motion } from 'framer-motion'

export default function About() {
  return (
    <section className="section" id="about">
      <motion.p className="statement" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
        Janet Holmes teaches piano: technique, theory, ear training and performance.
      </motion.p>
    </section>
  )
}
