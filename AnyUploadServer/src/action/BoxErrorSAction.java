package action;

import http.HOpCodeBox;
import protobuf.http.BoxErrorProto.BoxErrorCode;
import protobuf.http.BoxErrorProto.BoxErrorS;

public class BoxErrorSAction {
	public static BoxErrorS create(BoxErrorCode boxErrorCode, String errorHOpCode) {
		BoxErrorS.Builder errorBuilder = BoxErrorS.newBuilder();
		errorBuilder.setHOpCode(HOpCodeBox.BOX_ERROR);
		errorBuilder.setErrorCode(boxErrorCode);
		errorBuilder.setErrorHOpCode(errorHOpCode);
		return errorBuilder.build();
	}
}
