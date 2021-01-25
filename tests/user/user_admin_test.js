process.env.NODE_ENV = "test";

let faker = require("faker");
const bcrypt = require("bcryptjs");
const db = require("../../models");
let User = db.User;
let UserDetails = db.UserDetails;
let Activity = db.Activity;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
const { assert } = require("chai");
let should = chai.should();

chai.use(chaiHttp);

const user = { username: "admin", password: "pass" };
let token;

describe("Users - ADMIN", () => {
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

  describe("/GET users", () => {
    it("GET users, should succeed", (done) => {
      User.findOne({ raw: true }).then((user) => {
        chai
          .request(server)
          .get("/users/" + user.id)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.id.should.eql(user.id);
            res.body.username.should.eql(user.username);
            assert.deepEqual(
              new Date(res.body.lastSeen),
              new Date(user.lastSeen)
            );
            res.body.should.have.property("UserDetail");
            res.body.should.have.property("Role");
            done();
          });
      });
    });
  });

  describe("/POST user", () => {
    it("POST user, should succeed ", (done) => {
      const user = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        roleId: 1,
        teamId: 1,
        UserDetails: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          birthday: faker.date.past(),
          jobTitle: faker.name.jobTitle(),
        },
      };
      chai
        .request(server)
        .post("/users")
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property("id");
          User.findByPk(res.body.id).then((new_user) => {
            new_user.username.should.eql(user.username);
            assert.isTrue(bcrypt.compareSync(user.password, new_user.password));
            new_user.roleId.should.eql(user.roleId);
            new_user.teamId.should.eql(user.teamId);
            new_user.UserDetail.firstName.should.eql(
              user.UserDetails.firstName
            );
            new_user.UserDetail.lastName.should.eql(user.UserDetails.lastName);
            new_user.UserDetail.email.should.eql(user.UserDetails.email);
            assert.deepEqual(
              new Date(new_user.UserDetail.birthday),
              new Date(user.UserDetails.birthday)
            );
            new_user.UserDetail.jobTitle.should.eql(user.UserDetails.jobTitle);
          });
          done();
        });
    });
  });

  describe("/PUT user", () => {
    let new_user_id;
    let update_data;

    before((done) => {
      User.create({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        roleId: 1,
        teamId: 1,
      }).then((new_user) => {
        UserDetails.create({
          userId: new_user.id,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          birthday: faker.date.past(),
          jobTitle: faker.name.jobTitle(),
        });
        update_data = {
          id: new_user.id,
          username: faker.internet.userName(),
          password: faker.internet.password(),
          roleId: 2,
          teamId: 2,
          UserDetail: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            birthday: faker.date.past(),
            jobTitle: faker.name.jobTitle(),
          },
        };
        new_user_id = new_user.id;
        done();
      });
    });

    after((done) => {
      User.findOne({
        include: UserDetails,
        where: { id: new_user_id },
      }).then((updated_user) => {
        updated_user.username.should.eql(update_data.username);
        assert.isTrue(
          bcrypt.compareSync(update_data.password, updated_user.password)
        );
        updated_user.roleId.should.eql(update_data.roleId);
        updated_user.teamId.should.eql(update_data.teamId);
        updated_user.UserDetail.firstName.should.eql(
          update_data.UserDetail.firstName
        );
        updated_user.UserDetail.lastName.should.eql(
          update_data.UserDetail.lastName
        );
        updated_user.UserDetail.email.should.eql(update_data.UserDetail.email);
        assert.equal(
          new Date(updated_user.UserDetail.birthday).getDate(),
          new Date(update_data.UserDetail.birthday).getDate()
        );
        updated_user.UserDetail.jobTitle.should.eql(
          update_data.UserDetail.jobTitle
        );
        done();
      });
    });

    it("PUT user, should succeed ", (done) => {
      chai
        .request(server)
        .put("/users/" + new_user_id)
        .set({ Authorization: `Bearer ${token}` })
        .send(update_data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.id.should.eql(new_user_id);
          done();
        });
    });
  });

  // Delete and paranoid cascade issue
  // https://github.com/sequelize/sequelize/issues/2586

  describe("/DELETE user", () => {
    let user_id;
    let user_detail_id;
    let activity_id;

    before((done) => {
      User.create({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        roleId: 1,
        teamId: 1,
      }).then((new_user) => {
        user_id = new_user.id;
        UserDetails.create({
          userId: new_user.id,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          birthday: faker.date.past(),
          jobTitle: faker.name.jobTitle(),
        }).then((new_user_detail) => {
          user_detail_id = new_user_detail.id;
          Activity.create({
            title: faker.lorem.word(),
            description: faker.lorem.sentences(),
            type: faker.lorem.word(),
            hours: faker.random.number(),
            userId: user_id,
            date: new Date(),
            projectId: 1,
          }).then((activity) => {
            activity_id = activity.id;
            done();
          });
        });
      });
    });

    after((done) => {
      User.findByPk(user_id)
        .then((user) => {
          should.not.exist(user);
          UserDetails.findByPk(user_detail_id).then((user_detail) => {
            should.not.exist(user_detail);
            Activity.findByPk(activity_id).then((activity) => {
              should.not.exist(activity);
              done();
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("DELETE user, should succeed ", (done) => {
      chai
        .request(server)
        .delete("/users/" + user_id)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("id");
          res.body.id.should.eql(user_id.toString());
          done();
        });
    });
  });
});
