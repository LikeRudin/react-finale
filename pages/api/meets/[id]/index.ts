import { structuredNextApiHandler } from "@/libs/server/request-validator";
import { withSessionApiRoute } from "@/libs/server/session";
import validateAndHandleRequest from "@/libs/server/request-validator";
import client from "@/libs/server/prisma-client";

const handler: structuredNextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;

  if (!id) {
    return res.status(404).json({ ok: false, error: "잘못된 접근입니다." });
  }

  const user = req.session.user;
  if (!user) {
    return res.status(404).json({ ok: false, error: "로그인을 먼저 해주세요" });
  }

  switch (req.method) {
    case "GET":
      const meetUp = await client.meetUp.findUnique({
        where: {
          id: +id.toString(),
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          likes: {
            select: {
              userId: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          joins: {
            select: {
              userId: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          comments: {
            select: {
              id: true,
              createdAt: true,
              text: true,
              user: {
                select: {
                  id: true,
                  avatar: true,
                  username: true,
                },
              },
              parent: true,
              parentId: true,
              likes: true,
              comments: {
                include: { user: true, likes: true, comments: true },
              },
            },
          },
        },
      });
      if (!meetUp) {
        return res
          .status(404)
          .json({ ok: false, error: "MeetUp이 존재하지 않습니다." });
      }
      const isLiked = meetUp.likes.some((item) => item.userId === user.id);

      const isJoined = meetUp.joins.some((item) => item.userId === user.id);
      return res
        .status(202)
        .json({ ok: true, data: { meetUp, isLiked, isJoined } });
    case "PUT":
      if (+id!.toString() !== user.id) {
        return res.status(404).json({
          ok: false,
          error: "MeetUp 게시글 작성자 본인만 수정할 수 있습니다.",
        });
      }
      const {
        body: { name, location, schedule, description, imagepath },
      } = req;
      if (!(name && location && schedule && description)) {
        return res.status(404).json({
          ok: false,
          error:
            "name, location, schedule 그리고 description을 빠짐없이 작성해주세요",
        });
      }
      const transaction = await client.$transaction([
        client.meetUp.update({
          where: { id: +id.toString() },
          data: {
            name,
            schedule,
            location,
            description,
          },
        }),
        client.activityLog.create({
          data: {
            type: "MeetUpEdit",
            placeId: +id.toString(),
            user: {
              connect: { id: user.id },
            },
          },
        }),
      ]);

      if (!transaction) {
        return res.status(500).json({
          ok: false,
          error: "알수없는 오류로 업로드에 실패했습니다.",
        });
      }
      return res.status(202).json({ ok: true, data: id });

    case "DELETE":
      if (+id.toString() !== user.id) {
        return res.status(404).json({
          ok: false,
          error: "MeetUp 게시글 작성자 본인만 삭제할 수 있습니다.",
        });
      }
      const deleted = await client.meetUp.delete({
        where: { id: +id.toString() },
      });
      if (!deleted) {
        return res
          .status(500)
          .json({ ok: false, error: "알 수 없는 오류로 삭제에 실패했습니다." });
      }
      return res
        .status(202)
        .json({ ok: true, data: "MeetUp이 삭제되었습니다." });
  }
};

export default withSessionApiRoute(
  validateAndHandleRequest({ methods: ["PUT", "DELETE", "GET"], handler })
);
