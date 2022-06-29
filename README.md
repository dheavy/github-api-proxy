# Github User Search API Proxy

A simple demonstration of a Docker-based, Github API proxy for users search.

## Description

Runs a Docker container with an Express app, serving a simple search API at http://0.0.0.0:8080.

It proxies the search API for `users` and `repos` entities only, and will return the result of a valid [search query for a user](https://docs.github.com/en/rest/reference/search#search-users), and a subset of resulting users' repos (the 5 last updated).

> The results are paginated and yield objects 5 by 5 in order to save calls on the API rate limit.

### Proxy API usage

You need to call the `/search` endpoint with a `q` query variable, like this:

```
http://0.0.0.0:8080/search?q=<USER_QUERY>
```

Any search query valid for users in the Github API will work:

```
http://0.0.0.0:8080/search?q=tom+repos:>42+followers:>1000

// Returns results for users with the name "tom", restricted to users
// with more than 42 repositories and over 1,000 followers
```

### API call results

Results are very similar to that of GitHub's Open API specs, with two liberties taken.

First, in case of an error, the payload will add an `errors` array with human readable message for convenience (i.e. to display on a form in a UI).

```
// error result
{
    data: {...},
    errors: ["An error occurred..."]
}
```

Second, the `users` and `repos` are returned as separate attributes in the result object, to respect as much as possible the API specs of each entities as defined by Github, avoiding surprises when strongly typing or parsing their content.

```
// successful result => two distinct attributes in `data`
{
    data: {
        users: {},
        repositories: {},
        ...
    }
}
```

### API rate limit

The Github API has a [rate limit](https://docs.github.com/en/rest/rate-limit) in place.

When you hit that limit through the Proxy API, you will receive a `429 (Too Many Request)` error code.

To significantly raise the rate limit for the API:

* Create a `.env` file mirrored from the existing `.env.example` in the repo (`cp .env.example .env`)
* Create a **Personal Access Token** on Github by [clicking here](https://github.com/settings/tokens/new)
* Set that token as value of the `PERSONAL_ACCESS_TOKEN` variable in the `.env` file you just created

## Getting Started

### Dependencies

* Docker ([install from here](https://docs.docker.com/get-docker/))

### Executing program

* `cd` into the project directory
* Run `docker-compose up -d`
* Start making search request to http://0.0.0.0:8080

## Authors

Davy Braun ([https://github.com/dheavy](https://github.com/dheavy))

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

[Ginetta](http://ginetta.net/)
