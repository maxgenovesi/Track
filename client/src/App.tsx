import Header from './components/Header'
import './App.css'

export default function App() {
  return (
    <div className="app">
      {/* Home page only — the masthead is the landing, centered in the viewport.
          When routing lands, render <Header /> on the home route alone. */}
      <main className="app__main">
        <Header />
      </main>
    </div>
  )
}
