import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/Layout.tsx"
import HomePage from "./pages/HomePage.tsx"
import JobDetailsPage from "./pages/JobDetailsPage.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import Companies from "./pages/Companies.tsx"
import CompanyDetails from "./pages/CompanyDetails.tsx"

import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react'
import Tos from "./pages/Tos.tsx"
import CookiePolicy from "./pages/CookiePolicy.tsx"

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_TOKEN, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2026-01-30',
  cookieless_mode: 'on_reject'
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/job/:id",
        element: <JobDetailsPage />,
      },
      {
        path: "/companies",
        element: <Companies />,
      },
      {
        path: "/company/:id",
        element: <CompanyDetails />,
      },
      {
        path: "/tos",
        element: <Tos />,
      },
      {
        path: "/cookie-policy",
        element: <CookiePolicy />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      }
    ]
  }
])


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </PostHogProvider>
  </StrictMode>
)
