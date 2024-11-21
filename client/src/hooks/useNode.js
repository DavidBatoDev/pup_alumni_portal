import { useState } from 'react';

const useNode = () => {
  const insertNode = (tree, id, item) => {
    if (tree.comment_id === id) {
      return {
        ...tree,
        replies: [...tree.replies, item],
      };
    }

    return {
      ...tree,
      replies: tree.replies.map((child) => insertNode(child, id, item)),
    };
  };

  const editNode = (tree, id, value) => {
    if (tree.comment_id === id) {
      return {
        ...tree,
        content: value,
      };
    }

    return {
      ...tree,
      replies: tree.replies.map((child) => editNode(child, id, value)),
    };
  };

  const deleteNode = (tree, id) => {
    if (tree.comment_id === id) {
      return null;
    }

    const filteredReplies = tree.replies
      .map((child) => deleteNode(child, id))
      .filter((child) => child !== null);

    return {
      ...tree,
      replies: filteredReplies,
    };
  };

  const buildTree = (comments) => {
    const commentMap = {};
    const roots = [];

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.comment_id] = comment;
    });

    comments.forEach((comment) => {
      if (comment.parent_comment_id) {
        if (commentMap[comment.parent_comment_id]) {
          commentMap[comment.parent_comment_id].replies.push(comment);
        }
      } else {
        roots.push(comment);
      }
    });

    return roots;
  };

  return { insertNode, editNode, deleteNode, buildTree };
};

export default useNode;
