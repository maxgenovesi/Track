import Header from './components/Header'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <div className="app__content">
          <h1 className="app__title">Track</h1>
          <p className="app__subtitle">Scaffolding is up. Auth and CRUD come next.</p>
        </div>
      </main>
    </div>
  )
}
