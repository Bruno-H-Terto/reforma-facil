import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Guide } from './pages/Guide'
import { Library } from './pages/Library'
import { Questions } from './pages/Questions'
import { Simulator } from './pages/Simulator'
export default function App() {
  return <BrowserRouter><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="entenda" element={<Guide/>}/><Route path="simulador" element={<Simulator/>}/><Route path="biblioteca" element={<Library/>}/><Route path="duvidas" element={<Questions/>}/><Route path="*" element={<div><h1 className="text-2xl font-semibold">Página não encontrada</h1><Link className="mt-4 inline-block text-accent underline" to="/">Voltar ao início</Link></div>}/></Route></Routes></BrowserRouter>
}
