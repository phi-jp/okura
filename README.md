okura
=====

okura


## setup

```sh
$ git clone git@github.com:phi-jp/okura.git
$ cd okura
$ npm install
```

```sh
$ mongod
```

```sh
$ mongo
> use okuradb
> db.addUser('okura', 'okura')
> use okurasession
> db.addUser('okura', 'okura')
```

## run

```sh
$ npm start
```

access <http://localhost:1235>
