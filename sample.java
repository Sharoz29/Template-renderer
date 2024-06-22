
public class ra_when_lcs_calladoc_work_bookanappointment_comparelabslist_0 extends AbstractWhen {
 
    private final ScalarValueQuery scalarValueQuery_1;
 
    private static final RuleTraceInfo ruleTracer = new RuleTraceInfo("RULE-OBJ-WHEN LCS-CALLADOC-WORK-BOOKANAPPOINTMENT COMPARELABSLIST #20240614T133359.063 GMT", "LCS-CallADoc-Work-BookAnAppointment CompareLabsList", "CallADoc", "01-01-01", "20240614T134047.251 GMT");
 
    public ra_when_lcs_calladoc_work_bookanappointment_comparelabslist_0(final Loadtime loadtime) {

        super(ruleTracer);

        final QueryBuilderFactory queryBuilderFactory = loadtime.get(QueryBuilderFactory.class);

        scalarValueQuery_1 = queryBuilderFactory.create().allowMissingPropertyException().scalarProperty("pyGUID").buildScalarValueQuery();

    }
 
    protected boolean evaluate(final Runtime runtime, final ClipboardPage myStepPage, final ParameterPage params) {

        final PegaAPI pega = runtime.getPega();

        final PublicAPI tools = runtime.getTools();

        return (pega.<Boolean>resolveMethodCall("IsInPageList--(String,String,ClipboardProperty)", "IsInPageList", "Pega-RULES", "Utilities", new Object[] { tools.getParamValue("TempGUID"), scalarValueQuery_1.resolveToString(tools, myStepPage, ImmutablePropertyInfo.TYPE_TEXT), pega.findPageWithException("D_LabsList", "Code-Pega-List").getProperty(pega, "pxResults") })).booleanValue();

    }

}

// we need to fix below method to lookIn D_LabsList data page for any element of .ReferralForm.Labs Page List if there are any the update D_LabsList Data Page to contain the element with isChecked = true

boolean listInList(String lookFor) {
  
  ClipboardProperty lookIn = tools.getProperty("ReferralForm.Labs");


  boolean retValue = false;
  Iterator it = lookIn.iterator();


  while (it.hasNext()) {
    ClipboardProperty next = (ClipboardProperty) it.next();
    ClipboardPage nextPage = next.getPageValue();
    ClipboardProperty prop = nextPage.getIfPresent(lookAt);
    if (prop != null)
    {
      if (prop.getStringValue().equals(lookFor)) {
        retValue = true;
        break;
      }
    }
  }
  return retValue;

}