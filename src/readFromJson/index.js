// 必要なライブラリをインポートする
var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');

// データソースをインポートする
var data = require('./data.json');

// ２つの文字列フィールド（`id`と`name`）を持ったUser型を定義します。
// Userの型は、自分の型（今回の場合はGrapuQLString）を持つ子フィールドを
// 持ったGraphQLObjectTypeとなります。
var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString }
  }
});

// １つのtop-levelのフィールド`user`を持ったスキーマを定義します。
// それは引数`id`を取り、そのIDを持ったUserを返します。
// `query`はUserと同じようにGraphQLObjectTypeとなることに注意してください。
// しかしながら`user`フィールドは、上で定義したuserTypeとなります。
var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        // `args`は`user`クエリが許可する引数を記述します。
        args: {
          id: { type: graphql.GraphQLString }
        },
        // resolve関数は受け取ったクエリの解決方法
        // または実行方法を記述します。
        // 今回は`data`からUserをゲットするために、
        // keyとして上記の引数`id`を使います。
        resolve: function (_, args) {
          return data[args.id];
        }
      }
    }
  })
});

express()
  .use('/graphql', graphqlHTTP({ schema: schema, pretty: true }))
  .listen(4000);

console.log('GraphQL server running on http://localhost:4000/graphql');
