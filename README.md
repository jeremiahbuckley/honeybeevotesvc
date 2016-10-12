
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
- Node
- Express
- Mongoose
- Mocha
- Jasmine
- Frisby
- ESLint
- Grunt


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