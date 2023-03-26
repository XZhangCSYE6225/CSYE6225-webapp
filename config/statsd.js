import Statsd from "node-statsd";

const statsdClient = new Statsd({
    globalize: true,
    prefix: "csye6225."
});

export default statsdClient