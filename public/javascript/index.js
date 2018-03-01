(function () {
  function View (selector) {
    this.element = document.querySelector(selector);
    this.displayType = 'block';
  }

  View.prototype.removeClass = function (className) {
    this.element.classList.remove(className);
  };

  View.prototype.hide = function () {
    this.element.style.display = 'none';
  };

  View.prototype.show = function () {
    if (this.displayType !== 'block' && this.displayType !== 'inline-block') {
      throw new Error('Display type must be either block or inline block.');
    }

    this.element.style.display = this.displayType;
  };

  View.prototype.isHidden = function () {
    return !this.element.style.display || this.element.style.display === 'none';
  };

  View.getElement = function (el, selector) {
    return el.querySelector(selector);
  };

  View.getElements = function (el, selector) {
    return el.querySelectorAll(selector);
  };

  View.hideElement = function (el) {
    el.style.display = 'none';
  };

  View.showElement = function (el, displayType) {
    el.style.display = displayType;
  };

  View.clearElementValue = function (el) {
    el.value = '';
  };

  View.forEach = function (elements, cb) {
    Array.prototype.forEach.call(elements, cb);
  };

  window.View = View;
})();

(function () {
  function ListView (selector) {
    View.call(this, selector);
    this.selectedItemClassName = 'selected';
  }

  ListView.prototype = Object.create(View.prototype);
  ListView.prototype.constructor = ListView;

  ListView.prototype.updateSelection = function (dataType, data) {
    var that = this;

    View.forEach(View.getElements(that.element, 'li'), function reset (el) {
      if (el.dataset[dataType] !== data) {
        el.classList.remove(that.selectedItemClassName);
      } else {
        el.classList.add(that.selectedItemClassName);
      }
    });
  };

  ListView.prototype.clearSelection = function () {
    var that = this;

    View.forEach(View.getElements(that.element, 'li'), function reset (el) {
      el.classList.remove(that.selectedItemClassName);
    });
  };

  ListView.prototype.onListItemClick = function (cb) {
    this.element.addEventListener('click', function (e) {
      if (e.target.tagName !== 'LI') {
        return;
      }

      cb(e.target.dataset);
    });
  };

  window.ListView = ListView;
})();

(function () {
  function CurrentUserListView (selector) {
    ListView.call(this, selector);
  }

  CurrentUserListView.prototype = Object.create(ListView.prototype);
  CurrentUserListView.prototype.constructor = CurrentUserListView;

  CurrentUserListView.prototype.updateUsername = function (userID, username) {
    var targetListItem = View.getElement(this.element, '[data-id="' + userID + '"]');
    targetListItem.textContent = username;
  };

  CurrentUserListView.prototype.addNewUser = function (userID, username) {
    var listEl = document.createElement('li');

    listEl.classList.add('list-item');
    listEl.textContent = username;
    listEl.dataset.id = userID;

    this.element.appendChild(listEl);
  };

  window.CurrentUserListView = CurrentUserListView;
})();

(function () {
  function UserFormView (selector) {
    View.call(this, selector);
    this.displayType = 'block';
  }

  UserFormView.prototype = Object.create(View.prototype);
  UserFormView.prototype.constructor = UserFormView;

  UserFormView.prototype.getUserTypeFieldValue = function () {
    return Number(View.getElement(this.element, 'select').value);
  };

  UserFormView.prototype.inspect = function () {
    var result = {
      error: null,
      fieldValues: {}
    };

    View.forEach(View.getElements(this.element, 'input'), function (el) {
      if (!el.value) {
        result.error = el.id;
      } else {
        result.fieldValues[el.id] = el.value;
      }
    });

    return result;
  };

  UserFormView.prototype.showSuccessMode = function () {
    this.removeClass('error');
    View.showElement(View.getElement(this.element, '.success-message'), 'block');
    View.hideElement(View.getElement(this.element, 'button.submit'));
    View.hideElement(View.getElement(this.element, 'button.cancel'));
    View.showElement(View.getElement(this.element, 'button.close'), 'inline-block');
  };

  UserFormView.prototype.reset = function () {
    var successMessageEl = View.getElement(this.element, '.success-message');
    var submitButtonEl = View.getElement(this.element, 'button.submit');
    var cancelButtonEl = View.getElement(this.element, 'button.cancel');
    var closeButtonEl = View.getElement(this.element, 'button.close');
    var inputFieldEls = View.getElements(this.element, 'input');

    this.removeClass('error');
    View.hideElement(successMessageEl);
    View.showElement(submitButtonEl, 'inline-block');
    View.showElement(cancelButtonEl, 'inline-block');
    View.hideElement(closeButtonEl);
    View.forEach(inputFieldEls, View.clearElementValue);
  };

  UserFormView.prototype.triggerError = function () {
    this.element.classList.add('error');
  };

  UserFormView.prototype.updateUserTypeSelection = function (type) {
    var userTypeSelectionEl = View.getElement(this.element, 'select');
    userTypeSelectionEl.value = type;
  };

  UserFormView.prototype.onSave = function (cb) {
    var saveButtonEl = View.getElement(this.element, '.submit');
    saveButtonEl.addEventListener('click', cb);
  }

  UserFormView.prototype.onCancel = function (cb) {
    var cancelButtonEl = View.getElement(this.element, '.cancel');
    cancelButtonEl.addEventListener('click', cb);
  };

  UserFormView.prototype.onClose = function (cb) {
    var closeButtonEl = View.getElement(this.element, '.close');
    closeButtonEl.addEventListener('click', cb);
  };

  UserFormView.prototype.onUserTypeChange = function (cb) {
    View.getElement(this.element, 'select').addEventListener('change', function (e) {
      cb(e.currentTarget.value);
    });
  };

  window.UserFormView = UserFormView;
})();

(function () {
  function UpdateUserFormView (selector) {
    UserFormView.call(this, selector);
  }

  UpdateUserFormView.prototype = Object.create(UserFormView.prototype);
  UpdateUserFormView.prototype.constructor = UpdateUserFormView;

  UpdateUserFormView.prototype.fill = function (data) {
    View.forEach(View.getElements(this.element, 'input'), function (el) {
      el.value = data[el.id];
    });

    View.getElement(this.element, 'select').value = data.type;
  };

  window.UpdateUserFormView = UpdateUserFormView;
})();

(function () {
  function NavigationMenuView (selector) {
    ListView.call(this, selector);

    this.select = function (routeName) {
      var listElements = this.element.querySelectorAll('li');
      var targetEl = this.element.querySelector('li[data-route="' + routeName + '"]');

      View.forEach(listElements, function (el) {
        el.classList.remove('selected');
      });

      targetEl.classList.add('selected');
    };
  }

  NavigationMenuView.prototype = Object.create(ListView.prototype);
  NavigationMenuView.prototype.constructor = NavigationMenuView;

  window.NavigationMenuView = NavigationMenuView;
})();


// User Collection Model
(function () {
  var userCollectionModel = (function () {
    var userIDCount = 0;
    var userCollection = [];

    return {
      selectedUser: null,
      createUser: function (userData) {
        var user = {
          id: userIDCount
        };

        userCollection[user.id] = user;
        this.updateUser(user.id, userData);
        userIDCount++;

        return userCollection[user.id];
      },
      getUser: function (userID) {
        return userCollection[userID];
      },
      updateUser: function (userID, newUserData) {
        var targetUser = userCollection[userID];

        for (var prop in newUserData) {
          if (newUserData.hasOwnProperty(prop)) {
            targetUser[prop] = newUserData[prop];
          }
        }
      }
    };
  })();

  window.userCollectionModel = userCollectionModel;
})();


// App Router
(function () {
  const FRAGMENT_SEPARATOR = '/#';

  var appRouter = {
    routeMap: {},
    clearQueryString: function (queryKey) {
      var [ currentRoute, currentQueryString ] = window.location.hash.split('?');
      var newQueryString = '';

      currentRoute = '/' + currentRoute;

      for (var routeName in this.routeMap) {
        if (this.routeMap[routeName].path === currentRoute && currentQueryString) {
          currentQueryString = currentQueryString.split('&');

          currentQueryString.forEach(function (queryOption, i) {
            var [ key, value ] = queryOption.split('=');

            if (queryKey !== key) {
              newQueryString += (key + '=' + value);

              if (i !== 0 || i !== currentQueryString.length - 1) {
                newQueryString += '&';
              }
            }
          });

          currentRoute = currentRoute.split('/#')[1];

          if (!newQueryString) {
            window.location.hash = currentRoute;
          } else {
            window.location.hash = (currentRoute + '?' + newQueryString);
          }
        }
      }
    },
    configure: function (routeOptions) {
      for (var prop in routeOptions) {
        routeOptions[prop].path = FRAGMENT_SEPARATOR + routeOptions[prop].path;
      }

      this.routeMap = routeOptions;
    },
    init: function () {
      var that = this;
      var [ currentRoute, currentQueryString ] = ('/' + window.location.hash).split('?');
      var queryOptions = {};

      for (var routeName in that.routeMap) {
        if (that.routeMap[routeName].path === currentRoute) {
          that.set(routeName);

          that.routeMap[routeName].handler.forEach(function (cb) {
            cb();
          });

          if (currentQueryString) {
            currentQueryString = currentQueryString.split('&');

            currentQueryString.forEach(function (queryOption) {
              var [ queryKey, queryValue ] = queryOption.split('=');

              if (that.routeMap[routeName].queryStringHandler[queryKey]) {
                that.routeMap[routeName].queryStringHandler[queryKey](queryValue);
              }

              queryOptions[queryKey] = queryValue;
            });

            that.setQueryString(queryOptions);
          }
        }
      }
    },
    on: function (routeName, cb) {
      this.routeMap[routeName].handler.push(cb);
    },
    set: function (routeName) {
      if (!this.validate(routeName)) {
        throw new Error('Invalid route.');
      }

      window.history.pushState({
        name: routeName
      }, routeName, this.routeMap[routeName].path);

      this.routeMap[routeName].handler.forEach(function (cb) {
        cb();
      });
    },
    setQueryString: function (queryOptions) {
      var queryStringResult = '?';
      var [ hashValue, currentQueryString ] = window.location.hash.split('?');

      if (!currentQueryString) {
        for (var prop in queryOptions) {
          queryStringResult += (prop + '=' + ('' + queryOptions[prop]));
        }
      } else {
        var newQueryStringData = {};

        currentQueryString = currentQueryString.split('&');

        currentQueryString.forEach(function (queryOption) {
          queryOption = queryOption.split('=');

          if (queryOptions[queryOption[0]]) {
            newQueryStringData[queryOption[0]] = queryOptions[queryOption[0]];
          } else {
            newQueryStringData[queryOption[0]] = queryOption[1];
          }
        });

        for (var prop in newQueryStringData) {
          queryStringResult += (prop + '=' + ('' + newQueryStringData[prop]));
        }
      }

      window.location.hash = hashValue.split('#')[1] + queryStringResult;
    },
    validate: function (routeName) {
      return !!this.routeMap[routeName];
    }
  };

  window.appRouter = appRouter;
})();

// App Controller
(function () {
  var noop = function () {};

  var USER_TYPES = {
    0: '일반인',
    1: '컴공학생',
    2: '웹개발자',
    3: '웹디자이너',
    4: '사장님'
  };

  var appController = {
    onNewUserSelection: function (data) {
      if (this.createUserFormView.isHidden()) {
        this.createUserFormView.show();
      } else {
        this.createUserFormView.reset();
      }

      var userType = data.type;

      this.newUserListView.updateSelection('type', userType);
      this.createUserFormView.updateUserTypeSelection(userType);

      this.router.setQueryString({
        userType: userType
      });
    },
    onCurrentUserSelection: function (data) {
      this.currentUserListView.updateSelection('id', data.id);

      if (this.updateUserFormView.isHidden()) {
        this.updateUserFormView.show();
      } else {
        this.updateUserFormView.reset();
      }

      this.userCollectionModel.selectedUser = this.userCollectionModel.getUser(data.id);
      this.updateUserFormView.fill(this.userCollectionModel.selectedUser);
    },
    cancelNewUserCreation: function () {
      this.createUserFormView.hide();
      this.createUserFormView.reset();
      this.newUserListView.clearSelection();
      this.router.clearQueryString('userType');
    },
    cancelCurrentUserUpdate: function () {
      this.updateUserFormView.hide();
      this.updateUserFormView.reset();
      this.currentUserListView.clearSelection();
    },
    createUser: function () {
      var userData;
      var inspectionResult = this.createUserFormView.inspect();

      if (inspectionResult.error) {
        this.createUserFormView.triggerError();
        return;
      }

      userData = userCollectionModel.createUser(Object.assign({}, {
        type: this.createUserFormView.getUserTypeFieldValue()
      }, inspectionResult.fieldValues));

      this.currentUserListView.addNewUser(userData.id, userData.username);
      this.createUserFormView.showSuccessMode();
    },
    updateUser: function () {
      var inspectionResult = this.updateUserFormView.inspect();

      if (inspectionResult.error) {
        this.updateUserFormView.triggerError();
        return;
      }

      var newUserData = Object.assign({}, inspectionResult.fieldValues, {
        type: this.updateUserFormView.getUserTypeFieldValue()
      });

      this.userCollectionModel.updateUser(this.userCollectionModel.selectedUser.id, newUserData);
      this.currentUserListView.updateUsername(this.userCollectionModel.selectedUser.id, this.userCollectionModel.selectedUser.username);
      this.updateUserFormView.showSuccessMode();
    },
    updateUserList: function (userType) {
      this.newUserListView.updateSelection('type', userType);
    },
    onRouteChange: function (data) {
      this.router.set(data.route);
    },
    onCreateRoute: function () {
      if (!this.createUserFormView.isHidden()) {
        this.createUserFormView.hide();
      }

      this.newUserListView.clearSelection();
      this.createPageView.show();
      this.userListPageView.hide();
      this.navigationMenuView.select('create');
    },
    onListRoute: function () {
      this.userListPageView.show();
      this.createPageView.hide();
      this.navigationMenuView.select('list');
    },
    init: function () {
      this.userCollectionModel = userCollectionModel;

      this.createPageView = new View('#create-user-view');
      this.userListPageView = new View('#user-list-view');
      this.newUserListView = new ListView('.new-user-selection');
      this.currentUserListView = new CurrentUserListView('.existing-user-list');
      this.createUserFormView = new UserFormView('.user-form.create');
      this.updateUserFormView = new UpdateUserFormView('.user-form.update');
      this.navigationMenuView = new NavigationMenuView('#navigation-menu ul');

      this.newUserListView.onListItemClick(this.onNewUserSelection.bind(this));
      this.currentUserListView.onListItemClick(this.onCurrentUserSelection.bind(this));
      this.createUserFormView.onCancel(this.cancelNewUserCreation.bind(this));
      this.createUserFormView.onClose(this.cancelNewUserCreation.bind(this));
      this.createUserFormView.onSave(this.createUser.bind(this));
      this.createUserFormView.onUserTypeChange(this.updateUserList.bind(this));
      this.updateUserFormView.onCancel(this.cancelCurrentUserUpdate.bind(this));
      this.updateUserFormView.onClose(this.cancelCurrentUserUpdate.bind(this));
      this.updateUserFormView.onSave(this.updateUser.bind(this));
      this.navigationMenuView.onListItemClick(this.onRouteChange.bind(this));

      this.router = appRouter;

      this.router.configure({
        create: {
          path: '/',
          handler: [ this.onCreateRoute.bind(this) ],
          queryStringHandler: {
            userType: function onUserTypeQuery (userTypeValue) {
              appController.newUserListView.updateSelection('type', userTypeValue);
              appController.createUserFormView.updateUserTypeSelection(userTypeValue);

              if (appController.createUserFormView.isHidden()) {
                appController.createUserFormView.show();
              } else {
                appController.createUserFormView.reset();
              }
            }
          }
        },
        list: {
          path: '/list',
          handler: [ this.onListRoute.bind(this) ]
        }
      });

      this.router.init();
    }
  };

  appController.init();
})();
