
# Honeybee voting
## A voting application based on the system described in [Honeybee Democracy](https://www.amazon.com/Honeybee-Democracy-Thomas-D-Seeley/dp/0691147213/ref=asap_bc?ie=UTF8)

1.	A vote is a public influencer, voter can be anonymous.
2.	Votes give a candidate a value. The value fades over time.
3.	A voter is unable to vote again until original vote fades to zero plus a time of dormancy.
4.	Once a candidate crosses a value threshold, it wins.
  1.	It is possible that the value #2 determines influence sustaining duration, but that is not the same as the valuation of #4. (E.g. The value of #4 is simply the number of voters, not the voters*#2 valuation).
5.	If #4 is just # of voters, look to book honeybee democracy to determine % of voting body required to be a winner.

## Frameworks and Tools:
- Mongo db
- Mongoose
- Node
- Express
- Jasmine
- Mocha
- Frisby
- ESLint
- Grunt
- Passport

## What works/half-works at the moment
- Mongo: currently this expects mongo to be on the default port ('mongodb://localhost:27017/honeybeevote')
- Mongoose: I have a fair understanding of this, at this point.
- Express: on startup it should print out the port for express "The Magic happens on port: [0-9]*" (default: 8000)
- Testing: run "grunt default" in one cmd window, then elsewhere run "grunt test". will run unit and api tests.
   - Unit tests:
      - "grunt mochaTest"
   - Api tests:
      - "grunt shell"
      - "grunt jasmine_node"
- ESLint: to run lint, use this: grunt lint
- Grunt: I don't know half of what's in here, really, just following recipes.
	- I know: eslint, nodemon, concurrent
	- I don't know: pkg, babel
- Passport: just barely "heartbeats" as in does basic validation. The validation isn't actually applied anywhere or required.
- The whole thing could have better logging and .config
- Functionality: you should be able to do basic CRUD on Election, Voter, Candidate, and Candidate-[Votes]

- node-inspector debugging seems to be broken, a fix they're screaming about on node-inspector forums.
- I think .app.js works fine, but the original Express bootstrapping program has things running through ./biz/www, which also works fine. Obviously need to get rid of ./bin/www if it's not adding anything.

- Docker: You can containerize this app using 'docker build .' Once built, you can run the container with something like 'docker run -e MONGO_URL=mongodb://192.168.0.128:27017/honeybeevote -d -p 8000:8000 honeybeevotesvc' where MONGO_URL points to your mongo server.


## Features for voters
### V1
1.	Know what we are voting for.
2.	See all candidates and popularity.
3.	Ability to vote on candidates.
4.	Know when there's a winner.

### V2
1.	See time remaining until next vote allowed.
2.	See time remaining until vote goes to zero influence.
3.	See history of vote.
4.	Know information about voters.
5.	Add information to candidate.
6.	Add candidate.
7.	Be given > 1 vote to use at the same time.
8.	See graphics.
9.	Set win criteria, vote sustain duration, vote valuation calculation.
