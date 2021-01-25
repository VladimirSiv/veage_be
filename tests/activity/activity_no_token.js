process.env.NODE_ENV = "test";

let faker = require("faker");
const db = require("../../models");
let Activity = db.Activity;
let User = db.User;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
let should = chai.should();

chai.use(chaiHttp);

const user = { username: "user" };

describe("Activities - No Token", () => {
  describe("/GET activities", () => {
    it("GET activities, should fail ", (done) => {
      chai
        .request(server)
        .get("/activities")
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("No token provided!");
          done();
        });
    });
  });
  describe("/GET/:id activity", () => {
    it("GET activity, should fail", (done) => {
      User.findOne({ raw: true, where: { username: user.username } }).then(
        (user) => {
          Activity.findOne({ raw: true, where: { userId: user.id } }).then(
            (activity) => {
              chai
                .request(server)
                .get("/activities/" + activity.id)
                .end((err, res) => {
                  res.should.have.status(403);
                  res.body.should.have.property("message");
                  res.body.message.should.eql("No token provided!");
                  done();
                });
            }
          );
        }
      );
    });
  });
  describe("/POST activity", () => {
    it("POST activity, should fail", (done) => {
      User.findOne({ raw: true, where: { username: user.username } }).then(
        (user) => {
          let activity = {
            title: faker.lorem.word(),
            description: faker.lorem.sentences(),
            type: faker.lorem.word(),
            hours: faker.random.number(),
            userId: user.id,
            projectId: 1,
          };
          chai
            .request(server)
            .post("/activities/")
            .send(activity)
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.have.property("message");
              res.body.message.should.eql("No token provided!");
              done();
            });
        }
      );
    });
  });
  describe("/DELETE/:id activities", () => {
    it("DELETE activity, should fail", (done) => {
      User.findOne({ raw: true, where: { username: user.username } }).then(
        (user) => {
          Activity.findOne({ raw: true, where: { userId: user.id } }).then(
            (activity) => {
              chai
                .request(server)
                .delete("/activities/" + activity.id)
                .end((err, res) => {
                  res.should.have.status(403);
                  res.body.should.have.property("message");
                  res.body.message.should.eql("No token provided!");
                  done();
                });
            }
          );
        }
      );
    });
  });
});
