import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

vi.mock('../services/catfacts.service', () => ({
  catFactsService: {
    getRandomFact: vi.fn().mockResolvedValue({ fact: 'Un gato tiene 32 músculos en cada oreja.', length: 40 }),
    getPopularFacts: vi.fn().mockResolvedValue([
      { id: '1', fact: 'Los gatos duermen el 70% de sus vidas.', likesCount: 5 },
      { id: '2', fact: 'Un grupo de gatos se llama clowder.', likesCount: 3 },
    ]),
    getMyLikes: vi.fn().mockResolvedValue([]),
  },
}));

describe('Top 5 de la Comunidad', () => {
  it('debe renderizar el título del ranking y la lista de hechos populares', async () => {
    render(<App />);

    expect(screen.getByText(/Top 5 de la Comunidad/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/"Los gatos duermen el 70% de sus vidas."/i)).toBeInTheDocument();
      expect(screen.getByText(/"Un grupo de gatos se llama clowder."/i)).toBeInTheDocument();
    });

    expect(screen.getByText('🥇')).toBeInTheDocument();
    expect(screen.getByText('🥈')).toBeInTheDocument();

    expect(screen.getByText('❤️ 5')).toBeInTheDocument();
    expect(screen.getByText('❤️ 3')).toBeInTheDocument();
  });
});
