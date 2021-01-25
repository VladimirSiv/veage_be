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

const user = { username: "user", password: "pass" };
let token;

describe("Activities - USER", () => {
  before((done) => {
    chai
      .request(server)
      .post("/signin")
      .send(user)
      .end((err, res) => {
        token = res.body.access_token;
        done();
      });
  });

  // Get List
  describe("/GET activities", () => {
    it("GET activities, should succeed", (done) => {
      User.findOne({ raw: true, where: { username: user.username } }).then(
        (user) => {
          Activity.findAll({ raw: true, where: { userId: user.id } }).then(
            (activities) => {
              chai
                .request(server)
                .get("/activities")
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a("array");
                  res.body.length.should.be.eql(activities.length);
                  done();
                });
            }
          );
        }
      );
    });
  });
  describe("/GET/:id activity", () => {
    it("GET activity, should succeed", (done) => {
      User.findOne({ raw: true, where: { username: user.username } }).then(
        (user) => {
          Activity.findOne({ raw: true, where: { userId: user.id } }).then(
            (activity) => {
              chai
                .request(server)
                .get("/activities/" + activity.id)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property("id");
                  res.body.id.should.eql(activity.id);
                  done();
                });
            }
          );
        }
      );
    });
  });

  // Post
  describe("/POST activity", () => {
    it("POST activity, should succeed", (done) => {
      User.findOne({ raw: true, where: { username: user.username } }).then(
        (user) => {
          const activity = {
            title: faker.lorem.word(),
            description: faker.lorem.sentences(),
            type: faker.lorem.word(),
            hours: faker.random.number(),
            userId: user.id,
            date: new Date(),
            projectId: 1,
          };
          chai
            .request(server)
            .post("/activities/")
            .set({ Authorization: `Bearer ${token}` })
            .send(activity)
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.have.property("id");
              res.body.id.should.be.a("number");
              Activity.findByPk(res.body.id).then((a) => {
                a.title.should.be.eql(activity.title);
                a.description.should.be.eql(activity.description);
                a.type.should.be.eql(activity.type);
                a.hours.should.be.eql(activity.hours);
                a.userId.should.be.eql(activity.userId);
                a.projectId.should.be.eql(activity.projectId);
              });
              done();
            });
        }
      );
    });
  });
  describe("/DELETE/:id activities", () => {
    let user_id;
    let activity_id;

    before((done) => {
      User.findOne({ where: { username: user.username } }).then((user) => {
        user_id = user.id;
        Activity.create({
          title: faker.lorem.word(),
          description: faker.lorem.sentences(),
          type: faker.lorem.word(),
          hours: faker.random.number(),
          userId: user.id,
          date: new Date(),
          projectId: 1,
        }).then((activity) => {
          activity_id = activity.id;
          done();
        });
      });
    });

    after((done) => {
      Activity.findByPk(activity_id).then((activity) => {
        should.not.exist(activity);
        done();
      });
    });

    it("DELETE activity, should succeed", (done) => {
      chai
        .request(server)
        .delete("/activities/" + activity_id)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("id");
          res.body.id.should.eql(activity_id.toString());
          done();
        });
    });
  });
});
