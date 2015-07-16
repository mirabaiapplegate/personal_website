
$(function () {

  /////////////////////////////////////////////////
  // Models
  /////////////////////////////////////////////////
  var Task = Backbone.Model.extend({
    defaults: {
      title: '',
      completed: false
    },

    toggle: function () {
      this.save({
        completed: !this.get('completed')
      });
    }
  });

  /////////////////////////////////////////////////
  // Collections
  /////////////////////////////////////////////////

  var Tasks = Backbone.Collection.extend({
    model: Task,
    localStorage: new Backbone.LocalStorage("Tasks"),
    comparator: 'order',

    completed: function () {
      return this.where({completed: true});
    },
  });

  tasks = new Tasks();

  ////////////////////////////////////////////////
  // Views
  ////////////////////////////////////////////////

  var TasksView = Backbone.View.extend({

    template: _.template($("#tasks-view-template").text()),

    events: {
      'click .add-task':             'addTaskClickHandler',
      'keydown .task-content':       'addTaskKeydownHandler',
    },

  /* Public: Initialize the Tasks view.
   *
   * Returns nothing.
   */
    initialize: function () {
    },

  /* Public: Render the tasks view.
   *
   * Returns nothing.
   */
    render: function () {
      var html = this.template();
      this.$el.html(html);

      tasks.fetch();
      var completedTasks = tasks.where({ completed: false }),
          self  = this;

      _.each(completedTasks, function(task) { self.renderTask(task); });
    },

  /* Internal: Render the tasks.
   *
   * Instance of the Task Model.
   */
    renderTask: function (task) {
      var taskView = new TaskView({
        model: task
      });
      this.$(".tasks-outlet").append(taskView.$el);
      taskView.render();
    },

  /* Internal: Handle the click event to add a task.
   *
   * Returns nothing.
   */
    addTaskClickHandler: function(event) {
      if(this.$('#title').val() === '') {
        return;
      } else {
        var task = tasks.create({
          title: this.$('#title').val()
        });
        task.save();

        var view = new TaskView({ model: task });
        view.render();

        this.$(".tasks-outlet").append(view.$el);
        $('#title').val('');
      }
    },

  /* Internal: Handle the keydown event on return to add a task.
   *
   * Returns nothing.
   */
    addTaskKeydownHandler: function(e) {
      if(this.$('#title').val() === '') {
        return;
      } else {
        if (e.keyCode == 13) {
          var task = tasks.create({
            title: this.$('#title').val()
          });
          task.save();

          var view = new TaskView({ model: task });
          view.render();

          this.$(".tasks-outlet").append(view.$el);
          $('#title').val('');
        }
      }
    },

  });

  //////////////////////////////////////////////////////

  var TaskView = Backbone.View.extend({
    tagName: 'li',
    className: 'list-group-item task',

    template: _.template($("#task-view-template").text()),

    events: {
      'change .checkbox':   'changeCheckedHandler',
    },

  /* Public: Initialize the Task view.
   *
   * Returns nothing.
   */
    initialize: function () {
      this.render();
    },

  /* Public: Render the task view.
   *
   * Returns nothing.
   */
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    },

    changeCheckedHandler: function (event) {
      var audio = new Audio('Cat-meow.mp3');
      audio.play();

      this.model.set({ completed: true });
      this.model.save();
      this.remove();
    },

  });

  ////////////////////////////////////////////////
  // Start the app
  ////////////////////////////////////////////////

  var tasksView = new TasksView();
  $('.tasks-view-outlet').html(tasksView.$el);
  tasksView.render();

});
