import express from 'express';
import { join } from 'node:path';
import cookieParser from 'cookie-parser';

const app = express();
app.set('view engine', 'ejs');
app.set('views', './src/public/views');

app.use(express.static(join(process.cwd(), 'src', 'public')))
app.use(cookieParser());
app.use(express.json());

app.get('/', (_, response) => {
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

app.listen(3000)   