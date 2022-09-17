<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UpdateCodingProblem.aspx.cs" Inherits="OnlineLearningSystem.UpdateCodingProblem" ValidateRequest="false" %>
<%@ Register Src="Logout.ascx" TagName="Logout" TagPrefix="uc1" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Let's Use Data</title>
    <link rel="favicon icon" href="favicon.png" type="image/png" />
    <link href="Content/jquery-ui.css" rel="stylesheet" />
    <link href="Content/select2.css" rel="stylesheet" />
    <%--<link href="https://cdn.datatables.net/1.10.20/css/jquery.dataTables.css" rel="stylesheet" type="text/css" />--%>    <%: Styles.Render("~/Content/css") %>    <%-----------------------custome style----------------------%>
    <style>
        .margin-bottom-8 {
            margin-bottom: 8px;
        }

        #cke_1_contents {
            height: 150px !important;
        }

        #TextBoxExpectedOutput {
            height: 195px !important;
        }

        #TextBoxTestCode {
            height: 195px !important;
        }

        #TextBoxTestCodeForStudent {
            height: 195px !important;
        }

        #cke_EditorInstruction {
            margin-bottom: 8px;
        }

        #cke_HighlightText .cke_top {
            display: none !important;
            visibility: hidden !important;
            font-size: 16px !important;
        }

        #cke_HighlightText {
            font-size: 13px !important;
            line-height: 21 !important;
        }

        body {
            font-family: 'Raleway', sans-serif;
            font-size: 16px;
            line-height: 21px;
            /* color: #3b4047; */
            background-color: #fff;
        }

        div#HighlightText {
            border: 1px solid gainsboro;
            border-radius: 3px;
        }

        div#HighlightText:focus {
            color: #495057;
            background-color: #fff;
            border-color: #80bdff;
            outline: 0 !important;
            box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
        }

        .modal {
            margin-top: 76px;
            padding-bottom: 50px;
        }

        .hintsPicture {
            width: 70%;
        }
    </style>

    <!---------------- Global site tag (gtag.js) - Google Analytics ------------------>
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-196054626-1">
    </script>
    <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'UA-196054626-1');
    </script>
    <!------------------------------Close Google Analytics---------------------------->
    <!------------------------------Hints Modal -------------------------------------->
    <script>
        var req = new XMLHttpRequest();
        req.open('GET', '/files/hints.csv', true);
        req.onreadystatechange = function (aEvt) {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    info = addHints(req.responseText);
                    document.getElementById("accordion").innerHTML = info;
                }
                else
                    document.getElementById("accordion").innerHTML = "<p>Hints file is not available</p>";
            }
        };
        req.send(null);

        function addHints(allText) {
            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(';');
            var lines = "";

            for (var i = 1; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(';');
                if (data.length == headers.length) {
                    var accordionElement = `<div class="card">
                        <div class="card-header" id="heading`+ i + `">
                            <h2 class="mb-0">
                                <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse`+ i + `" aria-expanded="false" aria-controls="collapse` + i + `">
                                    <b>`+ data[1] + `: </b>` + data[0] + `
                                </button>
                            </h2>
                        </div>

                        <div id="collapse`+ i + `" class="collapse" aria-labelledby="heading` + i + `" data-parent="#accordion">
                            <div class="card-body">
                               <p><b>Syntax: `+ data[0] + `</b></p>
                               <p>`+ data[3] + `</p>
                               <p>Example:</p>
                               <img class="hintsPicture" src="/pictures/`+ data[2] + `">
                            </div>
                        </div>
                    </div>`;
                    lines += accordionElement;
                }
            }
            return lines;
        }
    </script>
    <!------------------------------Close Modal -------------------------------------->
</head>
<body>
    <%--========================================Top Navbar=================================--%>
    <section class="top-navbar-area">
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <nav class="navbar navbar-expand-lg navbar-light">
                        <div class="brand-logo">
                            <img src="Content/images/element2.png" />
                        </div>
                        <a class="navbar-brand padding-left-15">Online Learning System</a>
                        <!--<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>-->
                        <div class="collapse navbar-collapse" id="navbarText">
                            <%--             <ul class="navbar-nav ml-auto ">
                          <li class="nav-item active">
                            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link" href="#">Tutorial <span class="sr-only">(current)</span></a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link" href="#">Contact <span class="sr-only">(current)</span></a>
                          </li>
                        </ul>--%>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </section>
    <%--==================================================================================--%>    <%--========================================Content area=================================--%>
    <section class="content-area margin-top-15 margin-bottom-100">
        <!-- Modal -->
        <div class="modal fade" id="hintsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Metalanguage Hints</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="accordion" id="accordion">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End Modal -->
        <form id="form1" runat="server">
            <div class="add-course-area">
                <div style="margin: 0 60px;">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="text-right margin-bottom-15">
                                    <button type="button" id="openHints" class="btn btn-custom-light btn-sm" data-toggle="modal" data-target="#hintsModal">Hints</button>
                                    <asp:Button ID="Button30" CssClass="btn btn-custom-light btn-sm" runat="server" PostBackUrl="~/AssignCodingProblemToCourseInstance.aspx" Text="Assign Coding Problem to Course Instance" />&nbsp;
                                    <asp:Button ID="btnClearAll" CssClass="btn btn-custom-light btn-sm" runat="server" Text="Clear All" OnClick="btnClearAll_Click" />&nbsp;
                                    <uc1:Logout ID="ctlLogout" runat="server" />
                                </div>
                            </div>
                            <div class="col-md-12">
                                <h5>Update Coding Problem</h5>
                                <hr />
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="wraper-area margin-bottom-10">
                                            <div class="row margin-bottom-10">
                                                <div class="col-md-3">
                                                    <asp:Label CssClass="sp-label" ID="Label12" runat="server" Text="Course"></asp:Label>
                                                </div>
                                                <div class="col-md">
                                                    <asp:DropDownList CssClass="tex-box form-control" ID="DropDownListCourseFilter2" runat="server" AutoPostBack="True" OnSelectedIndexChanged="DropDownListCourseFilter2_SelectedIndexChanged"></asp:DropDownList>
                                                </div>
                                            </div>
                                            <div class="row margin-bottom-10">
                                                <div class="col-md-3">
                                                    <asp:Label CssClass="sp-label" ID="Label14" runat="server" Text="Quarter"></asp:Label>
                                                </div>
                                                <div class="col-md">
                                                    <asp:DropDownList CssClass="tex-box form-control" ID="DropDownListQuarterFilter2" runat="server" AutoPostBack="True" OnSelectedIndexChanged="DropDownListQuarterFilter2_SelectedIndexChanged"></asp:DropDownList>
                                                </div>
                                            </div>
                                            <div class="row margin-bottom-10">
                                                <div class="col-md-3">
                                                    <asp:Label CssClass="sp-label" ID="Label6" runat="server" Text="Course Instance"></asp:Label>
                                                </div>
                                                <div class="col-md">
                                                    <asp:DropDownList CssClass="tex-box form-control" ID="DropDownListCourseInstanceFilter" runat="server" AutoPostBack="True" OnSelectedIndexChanged="DropDownListCourseInstanceFilter_SelectedIndexChanged"></asp:DropDownList>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="wraper-area margin-bottom-10">
                                            <div class="row margin-bottom-10">
                                                <div class="col-md-3">
                                                    <asp:Label CssClass="sp-label" ID="Label9" runat="server" Text="Module Objective"></asp:Label>
                                                </div>
                                                <div class="col-md">
                                                    <asp:DropDownList CssClass="tex-box form-control" ID="DropDownListModuleObjectiveFilter" runat="server" AutoPostBack="True" OnSelectedIndexChanged="DropDownListModuleObjectiveFilter_SelectedIndexChanged"></asp:DropDownList>
                                                </div>
                                            </div>
                                            <div class="row margin-bottom-10">
                                                <div class="col-md-3">
                                                    <asp:Label ID="Label5" CssClass="sp-label" runat="server" Text="Select a Coding Problem"></asp:Label>
                                                </div>
                                                <div class="col-md">
                                                    <asp:DropDownList CssClass="tex-box form-control" ID="DropDownListCodingProblem" runat="server" AutoPostBack="True" OnSelectedIndexChanged="DropDownListCodingProblem_SelectedIndexChanged"></asp:DropDownList>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row margin-bottom-15">
                                    <div class="col-md-12">
                                        <div class="margin-top-10" style="text-align: left;">
                                            <table id="SameRow" runat="server">
                                                <tr>
                                                    <td>
                                                        <asp:Label ID="lblMessage" CssClass="font-size-15" runat="server" ForeColor="Red"></asp:Label>
                                                    </td>
                                                    <td>
                                                        <asp:LinkButton ID="btnMessageHelp"  runat="server" Visible ="false"><i id ="errorCompLink" href ="#errorCompDiv" style='font-size:24px;color:red' class='fas'>&#xf071;</i></asp:LinkButton>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <asp:Panel Visible="false" ID="PanelCodingProblem" runat="server">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="wraper-area">
                                        <div class="custome-form-group">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <h6 class="margin-bottom-10">Coding Problem</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="create-activity-area">
                                            <div class="row">
                                                <div class="col-sm-5">
                                                    <div class="row">
                                                        <div class="col-lg-3">
                                                            <asp:Label ID="Label3" CssClass="sp-label" runat="server" Text="Title"></asp:Label>
                                                        </div>
                                                        <div class="col-lg">
                                                            <asp:TextBox CssClass="tex-box form-control" ID="TextBoxTitle" runat="server"></asp:TextBox>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-lg-3 padding-r-0">
                                                            <asp:Label ID="Label7" CssClass="sp-label" runat="server" Text="Max Grade"></asp:Label>
                                                        </div>
                                                        <div class="col-lg-3 padding-r-0">
                                                            <asp:TextBox CssClass="tex-box form-control margin-bottom-8" ID="TextBoxMaxGrade" Text="100" type="number" runat="server"></asp:TextBox>
                                                        </div>
                                                        <div class="col-lg-2 padding-r-0">
                                                            <asp:Label ID="Label22" CssClass="sp-label" runat="server" Text="Type"></asp:Label>
                                                        </div>
                                                        <div class="col-lg-4">
                                                            <asp:Label ID="lblType" CssClass="tex-box form-control" runat="server" Text=""></asp:Label>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                            <asp:Label ID="Label8" CssClass="sp-label" runat="server" Text="Instructions"></asp:Label>
                                                        </div>
                                                        <div class="col-lg">
                                                            <textarea style="border: none" id="EditorInstruction" runat="server"></textarea>
                                                            <script src="Scripts/ckeditor/ckeditor.js"></script>
                                                            <script>
                                                                CKEDITOR.replace('EditorInstruction');
                                                            </script>
                                                        </div>
                                                    </div>
                                                    <asp:Panel ID="PanelGrid" Visible="false" runat="server">
	                                                    <div class="row">
		                                                    <div class="col-lg-12">
			                                                    <asp:Label ID="Label15" CssClass="sp-label" runat="server" Text="Variables"></asp:Label>
		                                                    </div>
		                                                    <div class="col-lg">
			                                                    <asp:Table ID ="TableValues" CssClass="table table-condensed table-striped" runat="server">
				                                                    <asp:TableRow>
					                                                    <asp:TableCell id="Cell11" Text="Name" />
					                                                    <asp:TableCell id="Cell12" Text="Values" />
				                                                    </asp:TableRow>
			                                                    </asp:Table>
		                                                    </div>
		                                                    <div class="col-md-12">
			                                                    <div class="margin-top-10" style="text-align: right;">
				                                                    <asp:Button ID="btnAddVariable" runat="server" CssClass="btn btn-custom btn-sm" Text="Add new variable" OnClick="AddVariable" AutoPostBack="True"/>
                                                                    <asp:Button ID="btnDelVariable" runat="server" CssClass="btn btn-custom btn-sm" Text="Delete last variable" OnClick="DelVariable" AutoPostBack="True"/>
				                                                    &nbsp;
			                                                    </div>
		                                                    </div>
	                                                    </div>
                                                    </asp:Panel>
                                                    <asp:HiddenField runat ="server" ID ="IndicateStart"/>
                                                    <asp:Panel ID="PanelCodeInstance" Visible="false" runat="server">
                                                        <div class="row">
                                                            <div class="col-lg-12">
                                                                <asp:Label ID="Label11" CssClass="sp-label" runat="server" Text="Script"></asp:Label>
                                                            </div>
                                                            <div class="col-lg">
                                                                <asp:TextBox CssClass="form-control font-size-13" ID="TextBoxScript" runat="server" TextMode="MultiLine"></asp:TextBox>
                                                                <asp:Button ID="setStartCode" CssClass="btn btn-custom btn-sm" runat="server" OnClientClick="ObtainFocusTextBoxScript()" OnClick="set_StartCode" Text="Set code limits" />
                                                                <%--<textarea class="form-control" id="HighlightText" oninput="HighlightSyntax()"></textarea>--%>
                                                                <%-- <script>
                                                                 CKEDITOR.replace('HighlightText');
                                                             </script>--%>
                                                                <%--<div style="height:100px" id="HighlightText" contenteditable="true" oninput="HighlightSyntax()"></div>--%>

                                                                <div id="ScriptTextShow"></div>
                                                            </div>
                                                        </div>
                                                        <div class="row margin-bottom-10">
                                                            <div class="col-lg-12">
                                                                <asp:Label ID="Label13" CssClass="sp-label" runat="server" Text="Solution"></asp:Label>
                                                            </div>
                                                            <div class="col-lg">
                                                                <asp:TextBox CssClass="form-control font-size-13" ID="TextBoxSolution" runat="server" TextMode="MultiLine"></asp:TextBox>
                                                            </div>
                                                        </div>
                                                    </asp:Panel>
                                                    <asp:Panel ID="PanelTestCase" Visible="false" runat="server">
                                                        <div class="row">
                                                            <div class="col-lg-4">
                                                                <asp:Label ID="Label18" CssClass="sp-label" runat="server" Text="Test Case Class"></asp:Label>
                                                            </div>
                                                            <div class="col-lg">
                                                                <asp:TextBox CssClass="tex-box form-control" ID="TextBoxTestCaseClass" runat="server"></asp:TextBox>
                                                            </div>
                                                        </div>
                                                    </asp:Panel>
                                                </div>
                                                <div class="col-sm">
                                                    <asp:Panel ID="PanelLanguage" Visible="false" runat="server">
                                                        <div class="row">
                                                            <div class="col-lg-4">
                                                                <asp:Label Visible="false" CssClass="sp-label" ID="LabelProgram" runat="server" Text="Program"></asp:Label>
                                                                <asp:Label Visible="false" CssClass="sp-label" ID="LabelLanguage" runat="server" Text="Language"></asp:Label>
                                                            </div>
                                                            <div class="col-lg">
                                                                <asp:DropDownList CssClass="tex-box form-control" ID="DropDownListLanguage" runat="server" OnSelectedIndexChanged="DropDownListLanguage_SelectedIndexChanged" AutoPostBack="true"></asp:DropDownList>
                                                            </div>
                                                        </div>
                                                    </asp:Panel>
                                                    <asp:Panel ID="PanelExcelFile" Visible="false" runat="server">
                                                        <div class="wraper-area margin-bottom-8">
                                                            <h6 class="margin-bottom-10 margin-top-10">Expected Output:</h6>
                                                            <div class="row">
                                                                <div class="col-lg-6">
                                                                    <asp:FileUpload ID="FileUpload2" runat="server" />
                                                                </div>
                                                                <div class="col-lg-6 text-right">
                                                                    <asp:Button ID="Button1" CssClass="btn btn-custom btn-sm" runat="server" OnClick="btnUploadExpectedOutputFile_Click" Text="Upload" />
                                                                </div>
                                                            </div>
                                                            <asp:Label ID="lblmessageFile2" ForeColor="Red" runat="server" />
                                                        </div>
                                                    </asp:Panel>
                                                    <asp:Panel ID="PanelCodeInstance2" Visible="false" runat="server">
                                                        <div class="row">
                                                            <div class="col-lg-12">
                                                                <asp:Label ID="Label20" CssClass="sp-label" runat="server" Text="Before"></asp:Label>
                                                            </div>
                                                            <div class="col-lg">
                                                                <asp:TextBox CssClass="form-control font-size-13" ID="TextBoxBefore" runat="server" TextMode="MultiLine"></asp:TextBox>
                                                            </div>
                                                        </div>
                                                        <div class="row margin-bottom-10">
                                                            <div class="col-lg-12">
                                                                <asp:Label ID="Label21" CssClass="sp-label" runat="server" Text="After"></asp:Label>
                                                            </div>
                                                            <div class="col-lg">
                                                                <asp:TextBox CssClass="form-control font-size-13" ID="TextBoxAfter" runat="server" TextMode="MultiLine"></asp:TextBox>
                                                            </div>
                                                        </div>
                                                    </asp:Panel>
                                                    <div class="row">
                                                        <div class="col-lg-3">
                                                            <asp:Label ID="Label4" CssClass="sp-label" runat="server" Text="Role"></asp:Label>
                                                        </div>
                                                        <div class="col-lg">
                                                            <asp:DropDownList CssClass="tex-box form-control" ID="DropDownListRole" runat="server">
                                                                <asp:ListItem Value="">--Select Role--</asp:ListItem>
                                                                <asp:ListItem Value="0">Assessment</asp:ListItem>
                                                                <asp:ListItem Value="1">Final</asp:ListItem>
                                                                <asp:ListItem Value="2">Midterm</asp:ListItem>
                                                            </asp:DropDownList>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-lg-5">
                                                            <asp:Label CssClass="sp-label" ID="Label10" runat="server" Text="Active"></asp:Label>
                                                            &nbsp;  
                                                            <asp:CheckBox ID="CheckBoxActive" runat="server" Checked="true" />
                                                        </div>
                                                        <div class="col-lg-3">
                                                            <asp:Label ID="Label23" CssClass="sp-label" runat="server" Text="Attempts"></asp:Label>
                                                        </div>
                                                        <div class="col-lg-4">
                                                            <asp:TextBox CssClass="tex-box form-control margin-bottom-8" ID="TextBoxAttempts" Text="100" type="number" runat="server"></asp:TextBox>
                                                        </div>
                                                    </div>
                                                    <asp:Panel ID="PanelFileSubmit" Visible="false" runat="server">
                                                        <div class="row text-left">
                                                            <div class="col-md-12">
                                                                <div class="margin-top-10">
                                                                    <asp:Button ID="btnUpdateFileUploadProblem" runat="server" CssClass="btn btn-custom btn-sm" Text="Update Coding Problem" OnClick="btnUpdateCodingProblem_Click" />                                                              
                                                                    &nbsp;
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </asp:Panel>
                                                </div>
                                                <div class="col-sm">
                                                    <asp:Panel ID="PanelExpectedOutput" Visible="false" runat="server">
                                                        <div class="row">
                                                            <div class="col-lg-12">
                                                                <asp:Label ID="Label1" CssClass="sp-label" runat="server" Text="Expected Output"></asp:Label>
                                                            </div>
                                                            <div class="col-lg">
                                                                <asp:TextBox CssClass="form-control font-size-13" ID="TextBoxExpectedOutput" runat="server" TextMode="MultiLine"></asp:TextBox>
                                                                <asp:Button ID="btnSetGrades" CssClass="btn btn-custom btn-sm" runat="server" OnClick="btnSetGrades_Click" Text="Set Grades" />
                                                            </div>
                                                        </div>
                                                    </asp:Panel>
                                                    <asp:Panel ID="PanelTestCode" Visible="false" runat="server">
                                                        <div class="row">
                                                            <div class="col-lg-12">
                                                                <asp:Label ID="Label2" CssClass="sp-label" runat="server" Text="Test Code"></asp:Label>
                                                            </div>
                                                            <div class="col-lg">
                                                                <asp:TextBox CssClass="form-control font-size-13" ID="TextBoxTestCode" runat="server" TextMode="MultiLine"></asp:TextBox>
                                                            </div>
                                                            <div class="col-lg-12">
                                                                <asp:Label ID="Label16" CssClass="sp-label" runat="server" Text="Test Code For Student"></asp:Label>
                                                            </div>
                                                            <div class="col-lg">
                                                                <asp:TextBox CssClass="form-control font-size-13" ID="TextBoxTestCodeForStudent" runat="server" TextMode="MultiLine"></asp:TextBox>
                                                            </div>
                                                        </div>
                                                    </asp:Panel>
                                                    <asp:Panel ID="PanelCodeSubmit" Visible="false" runat="server">
                                                        <div class="row text-left">
                                                            <div class="col-md-12">
                                                                <div class="margin-top-10">
                                                                    <asp:Button ID="btnUpdateCodingProblem" runat="server" CssClass="btn btn-custom btn-sm" Text="Update Coding Problem" OnClick="btnUpdateCodingProblem_Click" />
                                                                    <asp:Button ID="btnTestCodingProblem" runat="server" CssClass="btn btn-custom btn-sm" Text="Test Coding Problem" OnClick="btnTestCodingProblem_Click" Width="206px" />                                                                
                                                                    &nbsp;
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </asp:Panel>
                                                </div>
                                            </div>
                                            <asp:Panel ID="ErrorCompilation" Visible="false" runat="server">
                                                <div id ="errorCompDiv" class="row">
                                                    <div class="col-lg-12">
                                                        <asp:Label ID="CodeLbl" CssClass="sp-label" runat="server" ForeColor ="Red" Text="Compilation error"></asp:Label>
                                                    </div>
                                                    <div class="col-lg">
                                                        <div class="row">
                                                            <div class="col-lg">
                                                                <asp:TextBox CssClass="form-control font-size-13" ID="TextBoxAllCode" runat="server" TextMode="MultiLine"></asp:TextBox>
                                                            </div>
                                                            <div class="col-lg">
                                                                <asp:TextBox CssClass="form-control font-size-13" ID="TextBoxErrorComp" runat="server" TextMode="MultiLine"></asp:TextBox>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </asp:Panel>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </asp:Panel>
                    </div>
                </div>
            </div>
        </form>
    </section>
    <%--===================================================================================--%><%--========================================footer area=================================--%>
    <section class="footer-area">
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <div class="footer-content">
                    </div>
                </div>
            </div>
        </div>
    </section>
    <%--=============================================================================--%><%: Scripts.Render("~/bundles/js") %>
    <script src="Scripts/jquery-ui.min.js"></script>
    <script src="Scripts/select2.min.js"></script>
    <script src="Scripts/ckeditor/ckeditor.js"></script>
    <script>
        CKEDITOR.replace('TextBoxInstruction');
    </script>
    <script>

        // $(function () {
        //     $("[id*=GridView1]").DataTable(
        //        {
        //            bLengthChange: true,
        //            //lengthMenu: [[5, 10, -1], [5, 10, "All"]],
        //            bFilter: true,
        //            bSort: true,
        //            bPaginate: false
        //        });
        //});

        $(document).ready(function () {
            $("#DropDownListCourseFilter1").select2();
            $("#DropDownListCourseFilter2").select2();
            $("#DropDownListQuarterFilter2").select2();
            $("#DropDownListCourseInstance").select2();
            $("#DropDownListModuleObjective").select2();
            $("#DropDownListCourseInstanceFilter").select2();
            $("#DropDownListModuleObjectiveFilter").select2();
            $("#DropDownListCodingProblem").select2();
        });
        $(function () {
            $(".DatePicker").datepicker({
                dateFormat: "d MM, yy",
                changeMonth: true,
                changeYear: true,
                yearRange: "-100:+50",
                minDate: new Date(1920, 0, 1),
                maxDate: new Date(2050, 0, 1),
                showAnim: "blind",
                showOn: "both",
                buttonText: "<i class='fa fa-calendar'></i>"

            });
        });
        $('#errorCompLink').on('click', function (e) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: $('#errorCompDiv').offset().top }, 1000);
        });

        //Obtain focus TextBoxString
        function ObtainFocusTextBoxScript() {
            var textBoxScriptElement = document.getElementById("TextBoxScript");
            var start = textBoxScriptElement.selectionStart;

            var textStringSel = textBoxScriptElement.textContent.substr(0, start);
            var cantEnter = (textStringSel.match(/\n/gm) || '').length + 1;

            start = parseInt(start) + parseInt(cantEnter);

            IndicateStart.value = start;
        }
    </script>
</body>
</html>
