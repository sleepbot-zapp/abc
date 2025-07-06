import React, { useState, useEffect } from 'react';
import { Target, Zap, Trophy, Play, Award, Users } from 'lucide-react';

export const Games: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<any>(null);

  const getGameIcon = (iconName: string) => {
    switch (iconName) {
      case 'target':
        return <Target className="w-8 h-8 text-blue-600" />;
      case 'zap':
        return <Zap className="w-8 h-8 text-emerald-600" />;
      case 'trophy':
        return <Trophy className="w-8 h-8 text-amber-600" />;
      default:
        return <Play className="w-8 h-8 text-gray-600" />;
    }
  };

  const fetchGames = () => {
    try {
      const storedGames = JSON.parse(localStorage.getItem('anon_games') || '[]');
      setGames(storedGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = (game: any) => {
    try {
      // Simulate game play with random score
      const randomScore = Math.floor(Math.random() * 1000) + 100;
      const playerName = prompt('Enter your name (optional):') || 'Anonymous';
      
      const score = {
        id: crypto.randomUUID(),
        player_name: playerName,
        score: randomScore,
        created_at: new Date().toISOString()
      };

      // Update localStorage
      const games = JSON.parse(localStorage.getItem('anon_games') || '[]');
      const gameIndex = games.findIndex((g: any) => g.id === game.id);
      if (gameIndex >= 0) {
        games[gameIndex].plays_count += 1;
        if (!games[gameIndex].high_scores) games[gameIndex].high_scores = [];
        games[gameIndex].high_scores.push(score);
        games[gameIndex].high_scores.sort((a: any, b: any) => b.score - a.score);
        games[gameIndex].high_scores = games[gameIndex].high_scores.slice(0, 10);
        localStorage.setItem('anon_games', JSON.stringify(games));
      }
      
      alert(`Game completed! Your score: ${randomScore} points`);
      fetchGames();
    } catch (error) {
      console.error('Error playing game:', error);
    }
  };

  const showLeaderboard = (game: any) => {
    setSelectedGame(game);
  };

  useEffect(() => {
    fetchGames();
    
    // Initialize with sample games if none exist
    const existingGames = localStorage.getItem('anon_games');
    if (!existingGames) {
      const sampleGames = [
        {
          id: crypto.randomUUID(),
          name: "Blueprint Challenge",
          description: "Test your architectural knowledge with design challenges",
          icon_name: "target",
          plays_count: 1250,
          high_scores: [
            { id: '1', player_name: 'Anonymous', score: 950, created_at: new Date().toISOString() },
            { id: '2', player_name: 'ArchMaster', score: 890, created_at: new Date().toISOString() }
          ]
        },
        {
          id: crypto.randomUUID(),
          name: "Structure Builder",
          description: "Build stable structures with limited materials",
          icon_name: "zap",
          plays_count: 892,
          high_scores: [
            { id: '1', player_name: 'BuilderAnon', score: 1200, created_at: new Date().toISOString() }
          ]
        },
        {
          id: crypto.randomUUID(),
          name: "Design Quiz",
          description: "Quiz on architectural history and famous buildings",
          icon_name: "trophy",
          plays_count: 2103,
          high_scores: [
            { id: '1', player_name: 'QuizMaster', score: 800, created_at: new Date().toISOString() }
          ]
        }
      ];
      localStorage.setItem('anon_games', JSON.stringify(sampleGames));
      setGames(sampleGames);
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-300 rounded p-6 animate-pulse">
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-6"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-800 font-mono mb-1">/v/ - Games</h2>
        <p className="text-blue-600 font-mono text-sm">Architecture-themed games and challenges</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white border border-gray-300 rounded p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                {getGameIcon(game.icon_name)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 font-mono">{game.name}</h3>
                <p className="text-sm text-gray-500 font-mono">{game.plays_count} plays</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 font-mono text-sm">{game.description}</p>
            
            {game.high_scores && game.high_scores.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-gray-700 font-mono">High Score</span>
                </div>
                <p className="text-lg font-bold text-gray-900 font-mono">
                  {game.high_scores[0]?.score.toLocaleString()} points
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  by {game.high_scores[0]?.player_name}
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => handlePlayGame(game)}
                className="flex-1 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-mono text-sm"
              >
                Play Now
              </button>
              {game.high_scores && game.high_scores.length > 0 && (
                <button
                  onClick={() => showLeaderboard(game)}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Users className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {games.length === 0 && (
          <div className="col-span-full bg-white border border-gray-300 rounded p-8 text-center">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-mono">No games available yet. Check back soon!</p>
          </div>
        )}
      </div>

      {selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-300 rounded p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 font-mono">
                {selectedGame.name} Leaderboard
              </h3>
              <button
                onClick={() => setSelectedGame(null)}
                className="text-gray-400 hover:text-gray-600 font-mono text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedGame.high_scores.map((score: any, index: number) => (
                <div key={score.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                      index === 0 ? 'bg-amber-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-bold text-gray-900 font-mono">
                      {score.player_name}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 font-mono">
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