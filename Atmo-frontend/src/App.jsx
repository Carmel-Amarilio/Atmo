import { useState } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import './assets/styles/main.scss'

import { Home } from './views/Home'
import { store } from './store/store'
import { AtmoAction } from './views/AtmoAction'
import { Consultation } from './views/Consultation'
import { SignUp } from './views/SignUp'
import { CostSaving } from './views/CostSaving'
import { LogAnalysis } from './views/LogAnalysi'

export function App() {
  return (
    <Provider store={store}>
      <Router>
        <main >
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<SignUp />} path="/signup" />
            <Route element={<AtmoAction />} path="/action" />
            <Route element={<Consultation />} path="/consultation" />
            <Route element={<CostSaving />} path="/costsaving" />
            <Route element={<LogAnalysis />} path="/loganalysis" />
          </Routes>
        </main>
      </Router >
    </Provider>
  )
}

export default App

