
// Data
window.webProperties = {};
window.profilesByProperties = {};
window.profiles = {};
window.experimentsByProfiles = {};
window.experiments = {};

function getCurrentProfile() {
  var selectedOption = $('#target-profile option:selected');
  if(selectedOption.length > 0 && selectedOption.data('account-id') && selectedOption.data('property-id') && selectedOption.val()) {
    return { 'accountId': selectedOption.data('account-id'), 'webPropertyId': selectedOption.data('property-id'), 'profileId': selectedOption.val()}
  }
  else {
    alert('No profile selected!');
    return false;
  }
}

// UI
CodeMirror.defaults['mode'] = {name: "javascript", json: true};
CodeMirror.defaults['lineWrapping'] = false;
CodeMirror.defaults['readOnly'] = true;

window.updateInput = CodeMirror($('#update-panel div.input')[0], { readOnly: false });
window.insertInput = CodeMirror($('#insert-panel div.input')[0], { readOnly: false });

function loadProperties() {
  gapi.client.analytics.management.accounts.list().execute(function(accountsResponse){
    if (!accountsResponse.code) {
      if (accountsResponse && accountsResponse.items && accountsResponse.items.length) {
        var firstAccountId = accountsResponse.items[0].id;
        gapi.client.analytics.management.webproperties.list({
            'accountId': firstAccountId
        }).execute(function(webPropertiesResponse) {
          if (!webPropertiesResponse.code) {
            if (webPropertiesResponse && webPropertiesResponse.items && webPropertiesResponse.items.length) {

              window.webProperties = {};
              window.profilesByProperties = {};

              for(var i=0; i<webPropertiesResponse.items.length; i++)
              {
                window.webProperties[webPropertiesResponse.items[i].id] = webPropertiesResponse.items[i];
                window.profilesByProperties[webPropertiesResponse.items[i].id] = [];

                var propertySelect = $('#target-web-property');

                var opt = $(document.createElement("option"));
                opt.attr('data-account-id', webPropertiesResponse.items[i].accountId);
                opt.val(webPropertiesResponse.items[i].id);
                opt.html(webPropertiesResponse.items[i].name);
                propertySelect.append(opt);
              }
            } else {
              alert('No webproperties found for this user.');
            }
          } else {
            alert('There was an error querying webproperties: ' + webPropertiesResponse.message);
          }
        });
      } else {
        alert('No accounts found for this user.');
      }
    } else {
      alert('There was an error querying accounts: ' + accountsResponse.message);
    }
  });
}
$( "#target-web-property" ).change(function(e) {
  var selectedOption = $('#target-web-property option:selected');
  loadProfiles(selectedOption.data('account-id'), selectedOption.val());
});
function loadProfiles(accountId, propertyId) {
  window.profilesByProperties[propertyId] = [];
  var profileSelect = $('#target-profile');
  profileSelect.empty();

  gapi.client.analytics.management.profiles.list({
    'accountId': accountId,
    'webPropertyId': propertyId
  }).execute(function(profilesResponse) {
    if (!profilesResponse.code) {
      if (profilesResponse && profilesResponse.items && profilesResponse.items.length) {
        for(var i=0; i<profilesResponse.items.length; i++)
        {
          window.profiles[profilesResponse.items[i].id] = profilesResponse.items[i];
          window.profilesByProperties[propertyId].push(profilesResponse.items[i].id);

          var opt = $(document.createElement("option"));
          opt.attr('data-account-id', accountId);
          opt.attr('data-property-id', propertyId);
          opt.val(profilesResponse.items[i].id);
          opt.html(profilesResponse.items[i].name);
          profileSelect.append(opt);
        }
      } else {
        alert('No profiles found for this user.');
      }
    } else {
      alert('There was an error querying profiles: ' + profilesResponse.message);
    }
  });
}

$("#list-panel button.query-button").click(function(e) {
  listExperiments(getCurrentProfile(), function(response) {
    printOutput($("#list-panel .results"), response);
  });
});
$("#get-panel button.query-button").click(function(e) {
  getExperiment(getCurrentProfile(), $('#get-panel .experiment-id').val(), function(response) {
    printOutput($("#get-panel .results"), response);
  });
});
$("#update-panel button.query-button").click(function(e) {
  var experiment = JSON.parse(window.updateInput.getDoc().getValue());
  updateExperiment(getCurrentProfile(), experiment, function(response) {
    printOutput($("#update-panel .results"), response);
  });
});
$("#insert-panel button.query-button").click(function(e) {
  var experiment = JSON.parse(window.insertInput.getDoc().getValue());
  insertExperiment(getCurrentProfile(), experiment, function(response) {
    printOutput($("#insert-panel .results"), response);
  });
});
$("#delete-panel button.query-button").click(function(e) {
  deleteExperiment(getCurrentProfile(), $('#delete-panel .experiment-id').val(), function(response) {
    printOutput($("#delete-panel .results"), response);
  });
});

// Queries
function printOutput(target, response) {
  var results = target;
  results.empty();
  try {
    var prettyText = js_beautify(JSON.stringify((response && response.result) ? response.result : response));
    CodeMirror(results[0], {value: prettyText });
  }
  catch(excep) {
    // Do something about this error...
  }
}

function listExperiments(currentProfile, callback) {
  gapi.client.analytics.management.experiments.list({
    'accountId': currentProfile['accountId'],
    'profileId': currentProfile['profileId'],
    'webPropertyId': currentProfile['webPropertyId']
  }).execute(callback);
}
function getExperiment(currentProfile, experimentId, callback) {
  gapi.client.analytics.management.experiments.get({
    'accountId': currentProfile['accountId'],
    'profileId': currentProfile['profileId'],
    'webPropertyId': currentProfile['webPropertyId'],
    'experimentId': experimentId
  }).execute(callback);
}
function updateExperiment(currentProfile, experiment, callback) {
  gapi.client.analytics.management.experiments.update({
    'accountId': currentProfile['accountId'],
    'profileId': currentProfile['profileId'],
    'webPropertyId': currentProfile['webPropertyId'],
    'experimentId': experiment['id'],
    'resource': experiment
  }).execute(callback);
}
function insertExperiment(currentProfile, experiment, callback) {
  gapi.client.analytics.management.experiments.insert({
    'accountId': currentProfile['accountId'],
    'profileId': currentProfile['profileId'],
    'webPropertyId': currentProfile['webPropertyId'],
    'resource': experiment
  }).execute(callback);
}
function deleteExperiment(currentProfile, experimentId, callback) {
  gapi.client.analytics.management.experiments.delete({
    'accountId': currentProfile['accountId'],
    'profileId': currentProfile['profileId'],
    'webPropertyId': currentProfile['webPropertyId'],
    'experimentId': experimentId
  }).execute(callback);
}