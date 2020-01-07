# trick-or-treat-route-planner
ToT RP

## This is a nice thing that maps routes for trick-or-treaters depending on the distance between houses and the trick-or-treater's candy preferences. 

### Types

#### Child

* lives_at (House)
* candy_preference (Candy)
* candy_capacity
* name
* HP -optional

#### Candy

* name
* mass

#### House

* x
* y
* candy (Candy)
* neighbor_of (House), [distance]
* name
* poison_chance -optional

#### Queries

```
get_route(childId, preferredCandyId, timeLimit) {
  house
}
```

