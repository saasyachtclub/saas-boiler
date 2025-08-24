import HomePage from '@/app/page'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('HomePage', () => {
  it('renders the homepage', () => {
    render(<HomePage />)
    expect(screen.getByText('Welcome to SaaS Better')).toBeInTheDocument()
  })
})
