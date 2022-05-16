// disable?
let selectSectionDisable = false;

// section on focus
const selectSection = () => {
  if(!selectSectionDisable) {
    // compute what section to highlight
    // depending on mobile width?
    let threshold1, threshold2;

    if(window.innerHeight > 600) {
      threshold1 = window.innerHeight*0.3;
      threshold2 = window.innerHeight*0.15;
    } 
    else {
      threshold1 = window.innerHeight*0.1;
      threshold2 = window.innerHeight*0.1;
    }
    
    const fromY = (window.innerHeight/2)-threshold1;
    const toY = (window.innerHeight/2)+threshold2;


    for(let i=0; i<document.querySelectorAll(".sec").length; i++){
      const sec = document.querySelectorAll(".sec")[i];

      const b = sec.getBoundingClientRect();

      const top = b.top > fromY && b.top < toY;
      const middle = fromY > b.top && toY < b.bottom;
      const bottom = b.bottom > fromY && b.bottom < toY;

      /*
      if(i==0) {
        //console.log(i, test1,test2,test3);
        
        console.log(i, fromY, toY, b.top, b.bottom);

        // top - inside fromY and toY
        // console.log(b.top > fromY && b.top < toY)
        console.log("in top", top);
        console.log("in mid", middle);
        console.log("in bottom", bottom);
      }*/

      if( top || middle || bottom ) {
        // tood (only one should be selected).
        sec.classList.add("h");
      }

      else {
        sec.classList.remove("h");
      }
    }      
  }

  // all are selected?
  else {
    for(let i=0; i<document.querySelectorAll(".sec").length; i++) {
      document.querySelectorAll(".sec")[i].classList.add("h");
    }
  }
};

window.addEventListener("scroll", selectSection);

// ready
window.onload = () => {
  selectSection();
} ;   

// pull via fetch?
fetch('js/cv.json')
  .then(response => response.json())
  .then(data => {
    let myVue = Vue.createApp({
      data() {
        return data;
      }
    }).mount('#me');

    window.setTimeout(function() {
      document.querySelector("#loading").classList.add("loading-hide");
      document.querySelector("#me").classList.remove("me");
      selectSection();
    }, 500);
  });

/*
// pull via fetch?
const data = {
  "name" : {
    "initials" : "PB",
    "full" : "Paulo Napoleon Sicangco Bongato"
  },
  "email" : "paulobongato@gmail.com",
  "social" : {
    "facebook" : "paulobongato",
    "twitter" : "paulobongato",
    "linkedin" : "paulobongato"
  },
  "about" : "Hi! I'm Paulo Bongato, a 10+ year professional on IT front-end web development and a team leader on business development. I help create new designs for technology innovations, build client solutions for every-changing needs, and expand global reach for various marketing projects. Hardworking, results-driven and self-motivated, I can multi-task in different projects with focus tied to team orientation, project quality and long-term efficiency, with overall consideration for shareholder impact.",
  "works" : [
    {
      "title" : "Product Manager",
      "company" : "Xtenit Philippines, Inc.",
      "url" : "https://www.xtenit.com",
      "logo" : "img/xtenit.png",
      "years" : "January 2012 - Present",
      "description" : `<p><strong>Business Development </strong></p>
<ul>
<li>Maintain excellent working relationship with clients through constant communication, as well as through active participation in project design, development and deployment.</li>
<li>Translate business objectives and client feedback into functional platform features.</li>
<li>Write technical documents for the development team and custom project manuals for clients.</li>
<li>Research and propose new technologies, innovations or strategies that can increase value proposition of the software, and improve user interface and user experience.</li>
</ul>
<p><strong>Sales and Marketing </strong></p>
<ul>
<li>Assists in sales and marketing activities to promote various services of the platform to different B2B industries and organizations.</li>
<li>Attend conferences to promote the service in the ASEAN region.</li>
<li>Draft service proposal, and initiate contract negotiation with clients, and act as a signatory representative of the regional office.</li>
<li>Design marketing collateral for both online promotional activities and sponsorship events.</li>
</ul>
<p><strong>Project Management</strong></p>
<ul>
<li>Provide insights and expertise in building an open and efficient work environment with both development and administrative team.</li>
<li>Recommend project schedules and allocate work divisions for the each team.</li>
<li>Proposal, implementation and oversight of using collaborative web-based tools to improve work productivity.</li>
</ul>
<p><strong>Human Resources</strong></p>
<ul>
<li>Work with senior managers in setting general work environment rules and policies.</li>
<li>Coordinate conference calls with regional and international offices.</li>
<li>Assist in screening, testing, selection, hiring and training of new team members in different departments.</li>
</ul>
<p><strong>Administrative</strong></p>
<ul>
<li>Helps prepare and review documents to be submitted in compliance with government agencies.</li>
<li>Assess general work environment and suggest improvements if necessary, such as transitions to better work locations.</li>
<li>Assist the office manager with contract negotiations.</li>
</ul>`
    },
    {
      "title" : "Web Developer",
      "company" : "Xtenit Philippines, Inc.",
      "url" : "https://www.xtenit.com",
      "logo" : "img/xtenit.png",
      "years" : "June 2008 - Present",
      "description" : `<p><strong>Web Development </strong></p>
<ul>
<li>Lead the development team in creating websites for clients and prospects using Xtenit platform.</li>
<li>Proposal, implementation and improvement of new and existing features of the Xtenit platform.</li>
<li>Assist the customer support team to investigate, identify and address concerns related to</li>
<li>Manage SEO of corporate and client websites.</li>
<li>Implement web-based payment facilities such as PayPal and PayDollar for revenue opportunities such as pay walls, paid subscriptions, event registrations and paid content download.</li>
</ul>
<p><strong>Email Integration &amp; Delivery </strong></p>
<ul>
<li>Design and implement email templates for B2B and B2C clients and prospects with visual compatible for all devices and email readers.</li>
<li>Recommend email strategies and design to help improve subscriber interaction and increase subscriber list.</li>
<li>Monitor email delivery system and address issues of email bounce and blacklists.</li>
<li>Implement third-party relay services (SMTP) to address bounce concerns such as SparkPost.&nbsp;</li>
</ul>
<p><strong>System Development </strong></p>
<ul>
<li>Write automation scripts using back-end applications to send custom client reports.</li>
<li>Translate and transition client data from external system to architecture compatibility structure.</li>
<li>Monitor, report and occasionally fix issues related to web server, data server, delivery systems and IP network connections.</li>
</ul>`
    }
  ],
  "competencies" : [
    {
      "title" : "Spoken Languages",
      "description": `<ul>
<li>English (American English)</li>
<li>Filipino</li>
</ul>`
    },
    {
      "title" : "Programming Languages",
      "description": `<ul>
<li>HTML5</li>
<li>CSS3</li>
<li>Javascript</li>
<li>Bash Script</li>
<li>XML/XSLT</li>
</ul>`
    },
    {
      "title" : "Systems, Frameworks &amp; Tools",
      "description": `<ul>
<li>Google Cloud</li>
<li>Google Workspace</li>
<li>Zapier</li>
<li>Sparkpost</li>
<li>Salesforce</li>
<li>Wordpress</li>
<li>jQuery</li>
<li>Bootstrap</li>
<li>Vue.js</li>
<li>Angular</li>
<li>TinyMCE</li>
<li>fancyapps</li>
</ul>`
    },
    {
      "title" : "Technologies",
      "description": `<ul>
<li>Web Development</li>
<li>Web Design</li>
<li>UI/UX Design</li>
<li>SEO</li>
<li>Email Design</li>
<li>Email Delivery</li>
<li>Networking</li>
<li>REST API</li>
</ul>`
    },
    {
      "title" : "Servers &amp; Databases",
      "description": `<ul>
<li>Postfix</li>
<li>Apache Tomcat</li>
<li>PostgreSQL</li>
<li>Virtual Machines</li>
<li>MongoDB</li>
<li>MySQL</li>
</ul>`
    },
    {
      "title" : "Design Softwares",
      "description": `<ul>
<li>Adobe Photoshop</li>
<li>Gimp</li>
</ul>`
    }
  ],
  "education" : [
    {
      "years" : "September 2016 - Present",
      "degree" : "Graduate Studies",
      "title" : "Master of Business Administration (MBA)",
      "school" : "De La Salle University Manila",
      "logo" : "img/dlsu.png",
      "address" : "Manila, Philippines",
      "url" : "https://www.dlsu.edu.ph/colleges/rvrcob/academic-departments/management-organization-department/master-of-business-administration/"
    },
    {
      "years" : "May 2004 - June 2008",
      "degree" : "College",
      "title" : "Bachelor of Science in Computer Studies, Major in Software Technology",
      "school" : "De La Salle University Manila",
      "logo" : "img/dlsu.png",
      "address" : "Manila, Philippines",
      "url" : "https://www.dlsu.edu.ph/colleges/ccs/academic-departments/software-technology/"
    },
    {
      "years" : "May 2000 - March 2004",
      "degree" : "High School",
      "title" : "Specialization: Computer Technology",
      "school" : "Don Bosco Technical Institute Makati",
      "logo" : "img/dbti.png",
      "address" : "Makati City, Philippines",
      "url" : "https://donboscomakati.edu.ph/"
    },
  ],

  "others" : [
    {
      "title" : "Interests",
      "description" : `<div class="badges">
<ul>
<li>Basketball</li>
<li>Graphic Designs</li>
<li>Beach</li>
<li>Stock Trading</li>
<li>Cryptocurrency</li>
<li>Role-Playing Games</li>
<li>Horror Movies</li>
</ul>
</div>`
    },
    {
      "title" : "References",
      "description" : "Available upon request."
    },
  ]
};

let myVue = Vue.createApp({
  data() {
    return data;
  }
}).mount('#me');
*/
