const List = require('../models/List');
const boom = require('@hapi/boom');

exports.getLists = async (req, res) => {
  try {
    const lists = await List.find();
    return lists;
  } catch(err) {
    throw boom.boomify(err);
  }
}

exports.addNewList = async (req, res) => {
  try {
    const list = new List(req.body);
    console.log(list);
    const result = list.save();
    //const result = await List.create(req.body);
    return result;
  } catch(err) {
    throw boom.boomify(err);
  }
}

exports.addNewTask = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findById(id);
    list.tasks.push(req.body);
    const result = await List.findByIdAndUpdate(id, list, { new: true });
    return result;
  } catch(err) {
    throw boom.boomify(err);
  }
}

exports.toggleIsDone = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskIdx } = req.body;
    const list = await List.findById(id);
    console.log(list);
    list.tasks[taskIdx].isDone = !list.tasks[taskIdx].isDone;
    list.save();
    return {message: 'OK!'};
  } catch (err) {
    throw boom.boomify(err);
  }
}

exports.changeTaskPosition = async (req, res) => {
  try {
    const { id_list } = req.params;
    const { startIndex, endIndex } = req.body;
    const list = await List.findById(id_list);
    [list.tasks[startIndex], list.tasks[endIndex]] = [list.tasks[endIndex], list.tasks[startIndex]];
    list.save();
    return list;
  } catch (err) {
    throw boom.boomify(err);
  }
}

exports.moveTask = async (req, res) => {
  try {
    const { id_list_source, id_list_dest } = req.params;
    const { sourceIdx, destIdx } = req.body;
    const listSource = await List.findById(id_list_source);
    const listDest = await List.findById(id_list_dest);
    const task = listSource.tasks.splice(sourceIdx, 1)[0];
    listDest.tasks.splice(destIdx, 0, task);
    listSource.save();
    listDest.save();
    return [listSource, listDest];
  } catch(err) {
    throw boom.boomify(err);
  }
}

exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    await List.findByIdAndDelete(id);
    return { message: 'List deleted!' };
  } catch(err) {
    throw boom.boomify(err);
  }
}

exports.deleteTask = async (req, res) => {
  try {
    const { id_list, id_task } = req.params;
    const res = await List.findByIdAndUpdate(id_list, {
      new: true,
      $pull: { 'tasks': { _id: id_task } } 
    });
    return res;
  } catch(err) {
    throw boom.boomify(err);
  }
}

