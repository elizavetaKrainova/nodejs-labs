import express from 'express';
import { join } from 'node:path';
import cookieParser from 'cookie-parser';
import { createLogger, format, transports } from 'winston';

const app = express();
app.set('view engine', 'ejs');
app.set('views', './src/public/views');

app.use(express.static(join(process.cwd(), 'src', 'public')))
app.use(cookieParser());
app.use(express.json());

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app-node.log' }),
    ]
});

const logAll = (request, response, next) => {
    logger.info('URL being requested:', request.url);
    next();
}

app.get('/', logAll, (_, response) => {
    response.status(200)
        .render(join(process.cwd(), 'src', 'public', 'views', 'main'));
});

app.get('/:id', (request, response) => {
    response.status(200)
        .render(join(process.cwd(), 'src', 'public', 'views', 'personalPage'), { id: request.params.id });
});

app.post('/setLike', (request, response) => {
    const { id } = request.body;

    if (!id) {
        return response.status(400).json({ error: 'Image ID is required.' });
    }

    const currentLike = request.cookies[id] === 'true';
    const newLike = !currentLike;

    response.cookie(id, newLike, { httpOnly: false });
    response.status(200).json({ liked: newLike });
});

app.use((error, request, response, next) => {
    console.error(error);
    response.status(500).send('Something went wrong!');
});

app.listen(3000)   