let mockData = (function() {
  return {
    getMockStates: getMockStates,
    getMockTagList: getMockTagList,
    fileUploadMockData: getUploadMockData,
    folderListMockData: folderListMockData,
    newTagMockData: newTagMockData,
    createFolderMockData: createFolderMockData,
    getAutoCompleteMockData: getAutoCompleteMockData,
    getTotalUnreadEmailMockData: getTotalUnreadEmailMockData,
    emailDetailMockData: emailDetailMockData,
    getDeleteContactMockData: getDeleteContactMockData,
    getMoveContactMockData: getMoveContactMockData,
    getDeleteConversationMockData: getDeleteConversationMockData,
    getAvtarUploadMockData: getAvtarUploadMockData,
    getInitializeModifyFormMockData: getInitializeModifyFormMockData,
    getCreateNewContactMockData: getCreateNewContactMockData,
    getModifyContactMockData: getModifyContactMockData,
    createTask: getcreateTaskMockData,
    contactDetail: getcontactDetail,
    getTaskDetail: getTaskDetailMockData,
    getContactContact: getContactContact,
    getModifyTaskMockData : getModifyTaskMockData,
    getMarkAsCompleted : getMarkAsCompleted
  };

  function getMockStates() {
    return [
      {
        state: 'mail',
        config: {
          url: '/mail',
          template: '<mail></mail>',
          title: 'Mail',
          settings: {
            nav: 1,
            content: 'Mail',
            icon: '../images/mail-icon.svg'
          }
        }
      },
      {
        state: 'home',
        config: {
          url: '/',
          template: '<home></home>',
          title: 'Home'
        }
      },
      {
        state: 'login',
        config: {
          url: '/login',
          template: '<login></login>',
          title: 'Login'
        }
      },
      {
        state: 'mail.inbox',
        config: {
          url: '/inbox',
          template: '<mail-inbox></mail-inbox>',
          title: 'Inbox',
          settings: {
            nav: 2,
            content: 'Inbox (1)',
            icon: '../images/inbox.svg'
          }
        }
      },
      {
        state: 'mail.draft',
        config: {
          url: '/draft',
          template: '<mail-draft></mail-draft>',
          title: 'Draft',
          settings: {
            nav: 2,
            content: 'Drafts (2)',
            icon: '../images/drafts.svg'
          }
        }
      },
      {
        state: 'tasks',
        config: {
          url: '/tasks',
          template: '<tasks></tasks>',
          title: 'Tasks',
          settings: {
            nav: 1,
            content: 'Tasks',
            icon: '../images/task-icon.svg'
          }
        }
      },
      {
        state: 'contacts',
        config: {
          url: '/contacts',
          template: '<contacts></contacts>',
          title: 'Contacts',
          settings: {
            nav: 1,
            content: 'Contacts',
            icon: '../images/account-icon.svg'
          }
        }
      },
      {
        state: 'calender',
        config: {
          url: '/calender',
          template: '<calender></calender>',
          title: 'Calender',
          settings: {
            nav: 1,
            content: 'Calender',
            icon: '../images/calendar-icon.svg'
          }
        }
      },
      {
        state: 'contacts.contacts',
        config: {
          url: '/contacts',
          id:'7',
          template: '<contacts-contacts></contacts-contacts>',
          title: 'Contacts',
          settings: {
            nav: 2,
            content: 'Contacts',
            icon: '../images/inbox.svg'
          }
        }
      },
      {
        state: 'contacts.emailedContacts',
        config: {
          url: '/emailedContacts',
          id:'13',
          template: '<contacts-contacts></contacts-contacts>',
          title: 'Emailed Contacts',
          settings: {
            nav: 2,
            content: 'Emailed Contacts',
            icon: '../images/inbox.svg'
          }
        }
      },
      {
        state: 'contacts.trashContacts',
        config: {
          url: '/trashContacts',
          id:'3',
          template: '<contacts-contacts></contacts-contacts>',
          title: 'Trash Contacts',
          settings: {
            nav: 2,
            content: 'Trash Contacts',
            icon: '../images/trash.svg'
          }
        }
      },
      {
        state: 'contacts.distributionList',
        config: {
          url: '/distributionList',
          template: '<contacts-contacts></contacts-contacts>',
          title: 'Distribution List',
          settings: {
            nav: 2,
            content: 'Distribution List',
            icon: '../images/trash.svg'
          }
        }
      }
    ];
  }

  function getUploadMockData(){
    return [
      [{lastModified: 1440499728000,
        lastModifiedDate: new Date(1440499728000),
        name: "302_VNC_CloudMail-Redesign_Use-Case-3_Name_Folder.jpg",
        size: 329131,
        type: "image/jpeg",
        webkitRelativePath: ""
      }],
      `200,'null',[{"aid":"26283ce6-38ec-4b89-a2de-d86f771367af:a16617d7-1ee0-4216-b67d-7c8833874b1e","ct":"image/jpeg","filename":"206_VNC_CloudMail-Redesign_Use-Case-2_Reply_To_All_Text.jpg","s":246686}]`
    ];
  }

  function getAutoCompleteMockData(){
    return [{
      $:{email: "Mac Anh. Huy <macanh.huy@vnc.biz>",
        isGroup: "0",
        ranking: "417",
        type: "rankingTable"}
    },
      {$: {email: "Mac Anh. Huy <macanhhuydn@gmail.com>",
        isGroup: "0",
        ranking: "25",
        type: "rankingTable"}
      },
      {$: {
        email: "<huy.mac@vnc.biz>",
        isGroup: "0",
        ranking: "4",
        type: "rankingTable"}
      }
    ];
  }

  function getMockTagList() {
    return {gettagresponse: {
      tag:[
        {
          $: { color: "9",
          id: "7171",
          name: "best" }
        },
        {
          $: { id: "8718",
          name: "DucHo",
          rgb: "#66BB6A" }
        }
      ]
    }
    };
  }

  function newTagMockData() {
    return  {
      $:{},
      tag:{
        $:{
          id: "9021", name: "testing", rgb: "#66BB6A"
        }
      }
    };
  }

  function folderListMockData() {
    return {
      folder:{
        folder:{
          $:{
            name: 'test', color: 1
          },
          folder:{
            $:{
              name: 'test1', color: 2
            },
            folder:[]
          }
        }
      }
    };
  }

  function createFolderMockData() {
    return {
      $:{
        name: 'testing', color: 3
      },
      folder:{
        $:{
          name: 'test1', color: 2
        }
      }
    };
  }

  function getTotalUnreadEmailMockData() {
    return {
      $: {
        more: "0",
        offset: "0",
        sortBy: "dateDesc",
        xmlns: "urn:zimbraMail"},
      c: [{
        $: {d: "1448880609000",
          f: "uv",
          id: "-9028",
          n: "1",
          sf: "1448880609000",
          u: "1"},
        e:{$:{
          a: "jaydeep@zuxfdev.vnc.biz",
          d: "jaydeep",
          t: "f"}},
        fr: "testing",
        m:{$:{
          f: "uv",
          id: "9028",
          l: "2",
          s: "3544"}},
        su: "test appt from jaydeep 1st account"
      }]
    };
  }

  function getDeleteContactMockData() {
    return {
      $: {xmlns: "urn:zimbraMail"},
      action: {$: {id: "8960",
        op: "move"
      }}
    };
  }

  function getDeleteConversationMockData() {
    return {
      $: {xmlns: "urn:zimbraMail"},
      action: {$: {
        id: "-7391",
        op: "delete"
      }}
    };
  }


  function getMoveContactMockData() {
    return {
      $: {xmlns: "urn:zimbraMail"},
      action: {$: {
        id: "8717",
        op: "move"
      }}
    };
  }

  function getcreateTaskMockData(){
    return [
      {	 "name" : "unit test",
        "status" :  "Not Started",
        "priority" : "High",
        "percentComplete" :"0",
        "loc" : "TEST"
      },

      `200`
    ];
  }

  function getTaskDetailMockData(){

    return [
      {
        "$": {
          "xmlns": "urn:zimbraMail"
        },
        "m": {
          "$": {
            "rev": "1601",
            "s": "0",
            "d": "1448890406000",
            "t": "",
            "f": "?",
            "ms": "1601",
            "md": "1448890406",
            "tn": "",
            "id": "533-532",
            "l": "15"
          },
          "meta": "",
          "inv": {
            "$": {
              "type": "task"
            },
            "comp": {
              "$": {
                "loc": "SN",
                "method": "PUBLISH",
                "d": "1448890406000",
                "isOrg": "1",
                "percentComplete": "20",
                "priority": "9",
                "rsvp": "0",
                "noBlob": "1",
                "url": "",
                "x_uid": "2f25d2d2-690a-4192-bd0d-f770ce2966f5",
                "ciFolder": "15",
                "compNum": "0",
                "uid": "2f25d2d2-690a-4192-bd0d-f770ce2966f5",
                "calItemId": "533",
                "name": "My Test",
                "class": "PUB",
                "seq": "0",
                "status": "INPR"
              },
              "fr": "Test",
              "desc": "Test"
            }
          }
        }
      }
    ];
  }

  function emailDetailMockData() {
    return [
      {
        $: {
          cid: "-9048",
          cm: "1",
          d: "1449047897000",
          f: "a",
          id: "9048",
          l: "2",
          rev: "19907",
          s: "68207",
          sd: "1449047896000",
          sf: ""
        },
        e: [
          {
            $: {
              a: "jaydeep@zuxfdev.vnc.biz",
              d: "jaydeep",
              t: "f"
            }
          },
          {
            $: {
              a: "dhavald@zuxfdev.vnc.biz",
              d: "dhaval",
              p: "dhaval",
              t: "t"
            }
          }
        ],
        mailsCcShow: [],
        mailsToShow: [{
          displayName: "dhaval",
          email: "dhavald@zuxfdev.vnc.biz",
          fullName: "dhaval aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        }],
        mid: "<480480028.29025.1449047896392.JavaMail.zimbra@zuxfdev.vnc.biz>",
        mp: {
          $: {
            ct: "text/plain",
            part: "1",
            s: "0"
          },
          mp: [
            {
              $: {
                body: "1",
                ct: "text/html",
                part: "2.1",
                s: "261"
              },
              content: `<html><body><div style="font-family: arial, helvetica, sans-serif; font-size: 12pt; color: #000000"><div><img src="cid:21d60d5a78bc99cab2a69891618224456f27d62b@zimbra"></div></div></body></html>`
            },
            {
              $: {
                cd: "attachment",
                ci: "<21d60d5a78bc99cab2a69891618224456f27d62b@zimbra>",
                ct: "image/jpeg",
                filename: "cat_2830677b.jpg",
                part: "2.2",
                s: "47599"
              }
            }
          ]
        },
        su: "test"
      }
    ]
  }

  function getAvtarUploadMockData() {
    return [
      {0:{lastModified: 1440500090000,
        lastModifiedDate: new Date(1440500090000),
        name: "501_VNC_CloudMail-Redesign_Use-Case-5_Tag_Create.jpg",
        size: 379105,
        type: "image/jpeg",
        webkitRelativePath: ""}},
      `200,'null',[{"aid":"26283ce6-38ec-4b89-a2de-d86f771367af:6de25149-2459-4d07-a5a9-76ef94141968","ct":"image/jpeg","filename":"205_VNC_CloudMail-Redesign_Use-Case-2_Select_Reply_To_All.jpg","s":361427}]`,
      `http://localhost:8001/api/getAttachment?aid=26283ce6-38ec-4b89-a2de-d86f771367af:6de25149-2459-4d07-a5a9-76ef94141968`
    ]
  }

  function getInitializeModifyFormMockData() {
    return {
      $:{xmlns: "urn:zimbraMail"},
      cn: {
        $:{
          d: "1449066695000",
          fileAsStr: "",
          id: "8712",
          l: "7",
          rev: "19931"
        },
        a:[
          {$:{n: "imAddress1"}, _: "sdfdsa://undefined"},
          {$:{n: "imAddress2"}, _: "fds://undefined" },
          {$:{n: "imAddress3"}, _: "sfaf://undefined" },
          {$:{n: "email"}, _: "test@vnc.biz"}
        ]
      }
    }
  }

  function getCreateNewContactMockData() {
    return {
      $:{xmlns: "urn:zimbraMail"},
      cn:{
        $:{
          d: "1449474597000",
          fileAsStr: "d, d",
          id: "9117",
          l: "7",
          rev: "20630"
        },
        a:[
          {$:{n: "firstName"},_: "d"},
          {$:{n: "lastName"},_: "d"}
        ]
      }
    }
  }

  function getModifyContactMockData() {
    return {
      $:{
        xmlns: "urn:zimbraMail"
      },
      cn:{
        $:{
          d: "1449477382000",
          fileAsStr: "dedd",
          id: "8712",
          l: "7",
          rev: "20635"
        },
        a:[
          {$:{n: "firstName"},_: "dedd"},
          {$:{n: "mobilePhone"},_: "dddd"},
          {$:{n: "imAddress1"},_: "sdfdsa://undefined"},
          {$:{n: "imAddress2"},_: "fds://undefined"},
          {$:{n: "imAddress3"},_: "sfaf://undefined"},
          {$:{n: "email"},_: "test@vnc.biz"}
        ]
      }
    }
  }

  function getcontactDetail(){
    return {imAddress1: "dfsf", imAddress2: "sdfdsf", imAddress3: "sdfsdfsd"};
  }

  function getContactContact(){
    return [
      {$:{xmlns: "urn:zimbraMail"}, folder:{$:{absFolderPath: "/",
        activesyncdisabled: "0",
        i4ms: "1",
        i4next: "2",
        id: "1",
        l: "11",
        luuid: "9f3be293-187d-4db0-b959-f39645f16b01",
        ms: "1",
        n: "0",
        name: "USER_ROOT",
        rev: "1",
        s: "0",
        uuid: "09c48efe-634f-45d2-b495-0e22dbb19f87",
        webOfflineSyncDays: "0"},folder:[{$:{absFolderPath: "/Briefcase",
        activesyncdisabled: "0",
        i4ms: "1",
        i4next: "17",
        id: "16",
        l: "1",
        luuid: "09c48efe-634f-45d2-b495-0e22dbb19f87",
        ms: "1",
        n: "0",
        name: "Briefcase",
        rev: "1",
        s: "0",
        uuid: "d19e6efb-8c94-4bf9-8b34-5a64137c41a9",
        view: "document",
        webOfflineSyncDays: "0"}}], search:{$:{absFolderPath: "/abc",
        activesyncdisabled: "0",
        color: "1",
        id: "8704",
        l: "1",
        luuid: "09c48efe-634f-45d2-b495-0e22dbb19f87",
        ms: "18419",
        name: "abc",
        query: "sss",
        rev: "18419",
        sortBy: "",
        types: "conversation",
        uuid: "7d6c02f3-fbf3-428c-8ccb-1da9091b5e12",
        webOfflineSyncDays: "0"}}}},
      {$:{more: "1", offset: "0",sortBy: "nameAsc", xmlns: "urn:zimbraMail"},cn:[{$:{d: "1448021851000",
        fileAsStr: "", id: "8713", l: "7", rev: "18502",sf: "0000008713"}, a:[{$:{n: "imAddress1"}, _: "dfsf"},
        {$:{n: "imAddress2"}, _: "sdfdsf"},{$:{n: "imAddress3"}, _: "sdfsdfsd"}]}]},
      [{$:{xmlns: "urn:zimbraAccount"},dl:[{$:{dynamic: "0",
        id: "db0868d6-6a3e-411d-bc7a-7701469023cd",
        isMember: "1",
        isOwner: "0",
        name: "chat_vnctalk_users@zuxfdev.vnc.biz",
        ref: "uid=chat_vnctalk_users,ou=people,dc=zuxfdev,dc=vnc,dc=biz"}, a:[{$:{n: "zimbraDistributionListSubscriptionPolicy"},_: "REJECT"},{$:{n: "zimbraDistributionListUnsubscriptionPolicy"},_: "REJECT"}]},{
        $:{d: "mansi's list",
          dynamic: "0",
          id: "6082ec1c-6eaa-4f09-a8ed-a968d79038ef",
          isMember: "1",
          isOwner: "0",
          name: "dist1@zuxfdev.vnc.biz",
          ref: "uid=dist1,ou=people,dc=zuxfdev,dc=vnc,dc=biz"},a:[{$:{n: "zimbraDistributionListSubscriptionPolicy"},_: "REJECT"},{$:{n: "zimbraDistributionListSubscriptionPolicy"},_: "REJECT"}]}]}]
    ];
  }

  function getModifyTaskMockData() {
    return {
      "$":{
        "calItemId":"527",
        "rev":"3084",
        "ms":"3084",
        "invId":"527-526",
        "xmlns":"urn:zimbraMail"
      }
    }
  }


  function getMarkAsCompleted(){
    return [{'operation' : 'markAsCompleted'},
    {
      "$":{"calItemId":"537","rev":"3149","ms":"3149","invId":"537-536","xmlns":"urn:zimbraMail"}
    }]
  }
})();

export default mockData;
