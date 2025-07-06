import React, { useState, useEffect } from 'react';
import { getGames, getCurrentUser, incrementGamePlays, addGameScore, Game } from '../../lib/localStorage';
import { Target, Zap, Trophy, Play, Award, Users } from 'lucide-react';

export const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const currentUser = getCurrentUser();

  const getGameIcon = (iconName: string) => {
    switch (iconName) {
      case 'target':
        return <Target className="w-8 h-8 text-blue-600" />;
      case 'zap':
        return <Zap className="w-8 h-8 text-emerald-600" />;
      case 'trophy':
        return <Trophy className="w-8 h-8 text-amber-600" />;
      default:
        return <Play className="w-8 h-8 text-slate-600" />;
    }
  };

  const fetchGames = () => {
    try {
      const allGames = getGames();
      setGames(allGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = (game: Game) => {
    if (!currentUser) {
      alert('Please sign in to play games');
      return;
    }

    try {
      incrementGamePlays(game.id);
      
      // Simulate game play with random score
      const randomScore = Math.floor(Math.random() * 1000) + 100;
      addGameScore(game.id, currentUser.id, randomScore);
      
      alert(`Game completed! Your score: ${randomScore} points`);
      fetchGames();
    } catch (error) {
      console.error('Error playing game:', error);
    }
  };

  const showLeaderboard = (game: Game) => {
    setSelectedGame(game);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-6 animate-pulse">
              <div className="h-16 bg-slate-200 rounded mb-4"></div>
              <div className="h-6 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded mb-6"></div>
              <div className="h-12 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Architectural Games</h2>
        <p className="text-slate-600">Challenge yourself with architecture-themed games and puzzles</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                {getGameIcon(game.icon_name)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{game.name}</h3>
                <p className="text-sm text-slate-500">{game.plays_count} plays</p>
              </div>
            </div>
            
            <p className="text-slate-600 mb-4">{game.description}</p>
            
            {game.high_scores.length > 0 && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">High Score</span>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {game.high_scores[0]?.score.toLocaleString()} points
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => handlePlayGame(game)}
                disabled={!currentUser}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  currentUser
                    ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white hover:from-slate-800 hover:to-slate-950'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {currentUser ? 'Play Now' : 'Sign in to Play'}
              </button>
              {game.high_scores.length > 0 && (
                <button
                  onClick={() => showLeaderboard(game)}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Users className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {games.length === 0 && (
          <div className="col-span-full bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
            <Play className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No games available yet. Check back soon!</p>
          </div>
        )}
      </div>

      {selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {selectedGame.name} Leaderboard
              </h3>
              <button
                onClick={() => setSelectedGame(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedGame.high_scores.map((score, index) => (
                <div key={score.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-amber-500 text-white' :
                      index === 1 ? 'bg-slate-400 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-900">
                      Player {score.user_id.slice(0, 8)}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {score.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};