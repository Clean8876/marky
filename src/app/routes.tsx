import { Route, Routes } from "react-router-dom"

import { HomePage } from "@/modules/document/pages/HomePage"
import { EditorPage } from "@/modules/editor/pages/EditorPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/edit" element={<EditorPage />} />
    </Routes>
  )
}
