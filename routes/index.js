const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  /* Send out a set of links to the objects exposed by the API */
  /* TODO: These should be absolute URIs */
  res.status(200).send('index', [
    {
      index: {
        links: [{
          rel: 'self',
          href: '/'
        },
        {
          rel: 'candidates',
          href: '/candidates'
        },
        {
          rel: 'elections',
          href: '/elections'
        },
        {
          rel: 'voters',
          href: '/voters'
        }
      ]}
    }]);
});

module.exports = router;
