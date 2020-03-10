# Face classification login

* Version info
```
Ruby: 2.6.3
Ruby on Rails: 6.0.2
Python: 3.7
opencv: 3.4.9.31
```

* build
```
$ docker-compose build
$ docker-compose run web yarn install
$ docker-compose run web rails db:create db:migrate
```

* server start
```
$ docker-compose up
```

* server down
```
$ docker-compose down
```

* URL
main: http://localhost:3000
email: http://localhost:3000/letter_opener
sidekiq: http://localhost:3000/sidekiq
