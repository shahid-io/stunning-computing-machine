<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
<a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Overview

The **Task Queue System** is a server-side application built using the [NestJS](https://nestjs.com) framework. It leverages Redis and Bull for efficient task queue management, enabling scalable and reliable background job processing.

## Features

- **Task Queue Management**: Add, process, and monitor tasks in a queue.
- **Retry Mechanism**: Configurable retry attempts with exponential backoff.
- **Rate Limiting**: Control the rate of task processing.
- **Dashboard**: Visualize and manage queues using Bull Board.
- **Extensibility**: Modular design for easy integration with additional features.

## Architecture

The application is structured into the following key modules:

1. **Tasks Module**:
   - Handles task creation, processing, and status updates.
   - Uses MongoDB for task persistence and Bull for queue management.
   - Includes:
     - `TasksService`: Business logic for task operations.
     - `TasksProcessor`: Processes tasks from the queue.
     - `TasksController`: API endpoints for task management.

2. **Queue Utilities**:
   - Provides reusable configurations and constants for queue management.
   - Includes rate limiting, retry strategies, and backoff configurations.

3. **Bull Board Integration**:
   - A dashboard for monitoring and managing queues.
   - Accessible at `/admin/queues`.

## Prerequisites

Ensure the following are installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Redis](https://redis.io/) (for task queue management)
- [MongoDB](https://www.mongodb.com/) (for task persistence)

## Installation

Clone the repository and install dependencies:

```bash
$ git clone https://github.com/shahid-io/stunning-computing-machine.git
$ cd task-queue-system
$ npm install
```

## Configuration

Set up environment variables in a `.env` file. Refer to `.env.sample` for available configurations:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/TQS
REDIS_HOST=localhost
REDIS_PORT=6379
QUEUE_RATE_LIMIT=5
QUEUE_RATE_LIMIT_WINDOW=60
QUEUE_ATTEMPTS=3
QUEUE_BACKOFF_TYPE=exponential
QUEUE_BACKOFF_DELAY=1000
```

## Usage

### Running the Application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Accessing the Dashboard

The Bull Board dashboard is available at:

```
http://localhost:3000/admin/queues
```

### Running Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Endpoints

### Create a Task

**POST** `/tasks`

Request Body:
```json
{
  "type": "example-task"
}
```

Response:
```json
{
  "data": {
    "_id": "task-id",
    "type": "example-task",
    "status": "Pending",
    "attempts": 0
  },
  "message": "Task submitted successfully"
}
```

### Get All Tasks

**GET** `/tasks`

Response:
```json
[
  {
    "_id": "task-id",
    "type": "example-task",
    "status": "Completed",
    "attempts": 1
  }
]
```

## Deployment

For deployment, follow the [NestJS deployment guide](https://docs.nestjs.com/deployment).

```bash
$ npm install -g mau
$ mau deploy
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the [MIT License](https://github.com/shahid-io/stunning-computing-machine/blob/main/LICENSE).
