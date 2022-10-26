import './env';
import * as http from 'http';
import { Server } from 'socket.io';
import { AppDataSource } from './data-source';
import { Game } from './entity/Game';
import { Board, RandomChoice } from 'tictactoe-game-modules';

const server = http.createServer();
const io = new Server(server, { transports: ['websocket'] });

interface MakeMoveArgs {
  id: string;
  position: number;
}

io.on('connection', (socket) => {
  socket.on('start', async () => {
    const gameRepository = AppDataSource.getRepository(Game);
    const board = new Board();
    const game = new Game();
    game.board = board.grid;
    await gameRepository.save(game);
    socket.emit('play', {
      id: game.id,
      board: game.board,
    });
  });

  socket.on('getBoard', async (id: string) => {
    const gameRepository = AppDataSource.getRepository(Game);
    const game = await gameRepository.findOneBy({ id });
    socket.emit('board', {
      id: game.id,
      board: game.board,
    });
  });

  socket.on('makeMove', async ({ id, position }: MakeMoveArgs) => {
    const gameRepository = AppDataSource.getRepository(Game);
    const game = await gameRepository.findOneBy({ id });
    let board = new Board(game.board);
    if (board.currentMark() === 'X') {
      board = board.makeMove(position, 'X');
    }

    if (board.isGameOver()) {
      game.board = board.grid;
      await gameRepository.save(game);
      return;
    }

    //const minimax = new Minimax('O', 'X');
    //const bestMove = minimax.findBestMove(board);
    const random = new RandomChoice();
    const move = random.findRandomMove(board);
    board = board.makeMove(move, 'O');
    game.board = board.grid;
    await gameRepository.save(game);

    socket.emit('move', {
      id: game.id,
      position: move,
    });
  });
});

async function bootstrap() {
  await AppDataSource.initialize();

  server.listen(parseInt(process.env.PORT));
}

bootstrap();
